"""Run against an app with a separate test database. Creates an example project.
QR8_DB_PATH=/tmp/qr8-workflow-browser.sqlite npm run dev
python scripts/workflow-browser-smoke.py
"""
import os,re,time
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('QR8_TEST_URL','http://127.0.0.1:5173/')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='networkidle');page.get_by_text('Database connected',exact=True).wait_for()
 page.get_by_role('button',name='New project',exact=True).click();d=page.get_by_role('dialog');d.get_by_label('Project name',exact=True).fill('Workflow browser check '+str(time.time_ns())[-8:]);d.get_by_role('button',name='Create project',exact=True).click()
 nav=page.get_by_role('navigation',name='Project navigation');nav.get_by_role('button',name='Requests',exact=True).click()
 page.get_by_role('button',name='New request',exact=True).first.click();d.get_by_label('Request title',exact=True).fill('Add consultation booking');d.get_by_label('What should change, and why?',exact=True).fill('Visitors should book a consultation from a phone.');d.get_by_label('Requested by (recorded)',exact=True).fill('Example customer');d.get_by_role('button',name='Create request',exact=True).click()
 expect(d.get_by_text('Received',exact=True).first).to_be_visible()
 def reopen():
  nav.get_by_role('button',name='Requests',exact=True).click();page.locator('.request-card').filter(has_text='Add consultation booking').click()
 def step(label,fields={}):
  d.get_by_role('button',name=label,exact=True).click()
  for name,value in fields.items():d.get_by_label(name,exact=True).fill(value)
  d.get_by_role('button',name='Record step',exact=True).click();expect(d).to_have_count(0);reopen()
 step('Begin product review',{'Handoff / completion notes':'Clarify appointment types and availability.'})
 step('Consult engineering',{'Handoff / completion notes':'Assess booking provider and mobile integration.'})
 page.keyboard.press('Escape');nav.get_by_role('button',name='Office',exact=True).click();expect(page.get_by_text('ENGINEERING REVIEW',exact=True)).to_be_visible();expect(page.get_by_text('Workflow visualization · not a live meeting or agent conversation',exact=True)).to_be_visible();reopen()
 d.get_by_label('Question or feedback',exact=True).fill('Please include confirmation details.');d.get_by_role('button',name='Add comment',exact=True).click();expect(d.get_by_text('Comment saved.',exact=True)).to_be_visible()
 step('Propose scope',{'Proposed scope':'Embed the existing booking provider.','Acceptance criteria (one per line)':'Booking works on mobile.\nA confirmation is shown.'})
 step('Record scope approval',{'Reviewer name (recorded)':'Example customer','Decision / verification notes':'Approved scope v1 for this workflow test.'})
 d.get_by_role('button',name='Plan a task',exact=True).click();d.get_by_label('Task title',exact=True).fill('Implement consultation flow');d.get_by_label('Assign to',exact=True).select_option('pixel');d.get_by_role('button',name='Create task',exact=True).click();expect(d).to_have_count(0);reopen()
 step('Start implementation',{'Handoff / completion notes':'Scope approved; implementation can begin.'})
 # The server must reject premature submission and preserve the form.
 d.get_by_role('button',name='Submit deliverable for QA',exact=True).click();d.get_by_label('What changed in this deliverable?',exact=True).fill('Premature submission');d.get_by_role('button',name='Record step',exact=True).click();expect(d.get_by_role('alert')).to_contain_text('Complete every linked task');page.keyboard.press('Escape')
 nav.get_by_role('button',name='Tasks',exact=True).click();page.get_by_role('button',name=re.compile('Implement consultation flow')).click();d.get_by_label('Status',exact=True).select_option('Complete');d.get_by_role('button',name='Save changes',exact=True).click();reopen()
 step('Submit deliverable for QA',{'What changed in this deliverable?':'Booking flow first revision.','Preview URL (optional)':'https://example.com/booking-review'})
 step('Send to customer review',{'Reviewer name (recorded)':'Example QA reviewer','Decision / verification notes':'Recorded mobile and confirmation checks.'})
 step('Request changes',{'Reviewer name (recorded)':'Example customer','Decision / verification notes':'Make the confirmation clearer.'})
 expect(d.get_by_text('Changes requested',exact=True).first).to_be_visible()
 step('Resume implementation',{'Handoff / completion notes':'Address confirmation copy feedback.'})
 step('Submit deliverable for QA',{'What changed in this deliverable?':'Revision two clarifies the confirmation.'})
 step('Send to customer review',{'Reviewer name (recorded)':'Example QA reviewer','Decision / verification notes':'Reviewed the revised confirmation.'})
 step('Record customer approval',{'Reviewer name (recorded)':'Example customer','Decision / verification notes':'Approved deliverable revision two.'})
 step('Record verified release',{'Release operator (recorded)':'Example operator','Released feature URL':'https://example.com/booking','Decision / verification notes':'Recorded test-only release verification; no deployment was performed.'})
 step('Close request',{'Handoff / completion notes':'Workflow review complete.'})
 expect(d.get_by_text('Closed',exact=True).first).to_be_visible();expect(d.get_by_role('button',name='Add comment',exact=True)).to_have_count(0)
 page.keyboard.press('Escape');page.reload(wait_until='networkidle');reopen();expect(d.get_by_text('Closed',exact=True).first).to_be_visible();expect(d.get_by_text('Please include confirmation details.',exact=True)).to_be_visible()
 page.keyboard.press('Escape')
 for width in [320,390,768,1440]:
  page.set_viewport_size({'width':width,'height':900})
  for tab in ['Requests','Office','Tasks','Activity']:
   nav.get_by_role('button',name=tab,exact=True).click();assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),(width,tab)
  reopen();assert d.evaluate('(el)=>el.scrollWidth<=el.clientWidth');page.keyboard.press('Escape')
 assert not errors,errors;browser.close();print('PASS: request -> product/engineering -> versioned scope approval -> linked task -> QA -> customer changes -> revised deliverable -> approval -> recorded release -> closure; comments, validation, office visualization, persistence, and responsive layouts. No deployment or customer authentication was performed.')
