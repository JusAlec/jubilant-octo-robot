"""Check the read-only Pages bundle at the repository's nested URL path.
Run npm run build:pages first. Requires Python Playwright and Chromium.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import re
from playwright.sync_api import sync_playwright, expect
mount='/jubilant-octo-robot/'
class Handler(SimpleHTTPRequestHandler):
    def translate_path(self,path):
        if not path.startswith(mount):return '/nonexistent-qr8-test-path'
        return super().translate_path('/'+path[len(mount):])
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(Path(__file__).resolve().parents[1]/'dist')))
Thread(target=server.serve_forever,daemon=True).start()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000})
        errors=[];requests=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append((r.method,r.url)))
        page.route('**/api/**',lambda r:r.abort())
        page.goto(f'http://127.0.0.1:{server.server_port}{mount}',wait_until='networkidle')
        expect(page.get_by_role('heading',name='Building QR8.',exact=True)).to_be_visible()
        expect(page.get_by_text('Read-only preview',exact=True)).to_be_visible()
        expect(page.get_by_role('button',name='New project',exact=True)).to_be_disabled()
        expect(page.get_by_role('button',name='New task',exact=True).first).to_be_disabled()
        page.get_by_role('button',name=re.compile('Inspect Atlas,')).click()
        expect(page.get_by_role('dialog',name='Atlas')).to_be_visible()
        page.keyboard.press('Escape')
        nav=page.get_by_role('navigation',name='Project navigation')
        nav.get_by_role('button',name='Tasks',exact=True).click()
        expect(page.locator('.task-row')).to_have_count(3)
        page.get_by_role('button',name=re.compile('Connect GitHub project events')).click()
        expect(page.get_by_role('dialog').get_by_label('Status',exact=True)).to_be_disabled()
        expect(page.get_by_role('dialog').get_by_role('button',name='Read-only preview')).to_be_disabled()
        page.keyboard.press('Escape')
        nav.get_by_role('button',name='Activity',exact=True).click()
        expect(page.locator('.saved-event')).not_to_have_count(0)
        nav.get_by_role('button',name='Deliverables',exact=True).click()
        page.get_by_role('button',name=re.compile('Workspace foundation')).click()
        expect(page.get_by_role('dialog')).to_contain_text('Implemented:')
        page.keyboard.press('Escape')
        nav.get_by_role('button',name='Support',exact=True).click()
        expect(page.get_by_role('button',name='New ticket',exact=True)).to_be_disabled()
        for width in [390,768,1440]:
            page.set_viewport_size({'width':width,'height':900})
            for tab in ['Office','Tasks','Activity','Deliverables','Support']:
                nav.get_by_role('button',name=tab,exact=True).click()
                assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),(width,tab)
        assert not [r for r in requests if '/api/' in r[1] or r[0]!='GET'],requests
        assert not errors,errors
        browser.close()
        print('PASS: nested Pages URL, snapshot data, office/task/note inspectors, activity, read-only controls, mobile layouts, no API or write requests, no runtime errors.')
finally:
    server.shutdown();server.server_close()
