"""Synthetic local integration check. Never exports test deliveries to Pages.
Start with QR8_DB_PATH=/tmp/qr8-github-browser.sqlite and a test-only
QR8_GITHUB_WEBHOOK_SECRET (32+ characters) in the environment, then npm run dev.
The same secret must be available to this test process. It is never printed.
"""
import os,json,time,hmac,hashlib,urllib.request
from playwright.sync_api import sync_playwright,expect
secret=os.environ['QR8_GITHUB_WEBHOOK_SECRET']
base=os.environ.get('QR8_TEST_URL','http://127.0.0.1:5173/')
suffix=str(time.time_ns())[-8:];repo_id=int(suffix)+1000000000
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='networkidle');page.get_by_text('Database connected',exact=True).wait_for()
 page.get_by_role('button',name='New project',exact=True).click();d=page.get_by_role('dialog');d.get_by_label('Project name').fill('GitHub integration check '+suffix);d.get_by_role('button',name='Create project',exact=True).click()
 expect(page.get_by_role('heading',level=1)).to_contain_text('GitHub integration check '+suffix)
 page.get_by_role('button',name='New task',exact=True).first.click();d.get_by_label('Task title').fill('Validate signed GitHub evidence');d.get_by_role('button',name='Create task',exact=True).click();expect(page.locator('.task-row')).to_have_count(1)
 nav=page.get_by_role('navigation',name='Project navigation');nav.get_by_role('button',name='Connections',exact=True).click()
 page.get_by_label('Repository (owner/name)',exact=True).fill('qr8-test/integration-check')
 page.get_by_label('GitHub repository ID',exact=True).fill(str(repo_id));page.get_by_label('App installation ID (optional)',exact=True).fill('42')
 page.get_by_role('button',name='Save repository mapping',exact=True).click()
 expect(page.get_by_text('Awaiting first delivery',exact=True)).to_be_visible()
 for installation in ['43','42']:
  page.get_by_role('button',name='Edit mapping',exact=True).click()
  page.get_by_label('Expected installation ID',exact=True).fill(installation)
  page.get_by_role('button',name='Update mapping',exact=True).click()
  expect(page.get_by_text(__import__('re').compile('GitHub App installation '+installation))).to_be_visible()
 payload={'action':'opened','repository':{'id':repo_id,'full_name':'qr8-test/integration-check'},'installation':{'id':42},'pull_request':{'id':int(suffix),'number':1,'title':'Synthetic integration check','state':'open','updated_at':'2026-01-02T00:00:00Z','html_url':'https://github.com/qr8-test/integration-check/pull/1','head':{'sha':'a'*40}}}
 raw=json.dumps(payload).encode();signature='sha256='+hmac.new(secret.encode(),raw,hashlib.sha256).hexdigest()
 req=urllib.request.Request(base.rstrip('/')+'/api/webhooks/github',data=raw,headers={'Content-Type':'application/json','X-Hub-Signature-256':signature,'X-GitHub-Delivery':'browser-test-'+suffix,'X-GitHub-Event':'pull_request'},method='POST')
 with urllib.request.urlopen(req) as response:assert json.load(response)['outcome']=='recorded'
 page.get_by_role('button',name='Refresh project',exact=True).click();expect(page.get_by_text('Signed delivery received',exact=True)).to_be_visible()
 expect(page.get_by_text('PR #1: Synthetic integration check',exact=True)).to_be_visible()
 page.get_by_role('button',name='Link to a task',exact=True).click();page.get_by_label('Related task',exact=True).select_option(label='Validate signed GitHub evidence');page.get_by_role('button',name='Save link',exact=True).click()
 expect(page.get_by_text('Task: Validate signed GitHub evidence',exact=True)).to_be_visible()
 nav.get_by_role('button',name='Tasks',exact=True).click();task=page.get_by_role('button',name=__import__('re').compile('Validate signed GitHub evidence'));expect(task).to_contain_text('Queued');task.click();expect(d.get_by_role('link',name=__import__('re').compile('Synthetic integration check'))).to_have_attribute('href','https://github.com/qr8-test/integration-check/pull/1');page.keyboard.press('Escape')
 nav.get_by_role('button',name='Activity',exact=True).click();expect(page.get_by_text(__import__('re').compile('VERIFIED GITHUB'))).to_be_visible()
 for width in [320,390,768,1440]:
  page.set_viewport_size({'width':width,'height':900});nav.get_by_role('button',name='Connections',exact=True).click();assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
 assert not errors,errors;b.close();print('PASS: repository mapping, waiting/received states, signed synthetic ingestion, evidence links, task scope, source labeling, and responsive Connections view. No runtime errors. Synthetic data remains in the test database.')
