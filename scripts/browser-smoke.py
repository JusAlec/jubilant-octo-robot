"""QR8 workspace browser checks. Run against an isolated development database.
Example: QR8_DB_PATH=/tmp/qr8-browser.sqlite npm run dev
Then: python scripts/browser-smoke.py
Requires Python Playwright and /usr/bin/chromium. Creates uniquely named test projects.
"""
import os
import re
import time
from playwright.sync_api import sync_playwright, expect
url = os.environ.get('QR8_TEST_URL','http://127.0.0.1:5173/')
suffix=str(time.time_ns())[-9:]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    page=context.new_page(); errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    assert page.goto(url,wait_until='networkidle').status==200
    expect(page.get_by_text('Database connected',exact=True)).to_be_visible()
    expect(page.locator('.hero')).to_have_count(0)

    def nav(name): page.get_by_role('navigation',name='Project navigation').get_by_role('button',name=name,exact=True).click()
    page.get_by_role('button',name='New project',exact=True).click()
    dialog=page.get_by_role('dialog')
    dialog.get_by_label('Project name',exact=True).fill('Browser workspace '+suffix)
    dialog.get_by_label('Description',exact=True).fill('Isolated browser verification project')
    dialog.get_by_role('button',name='Create project',exact=True).click()
    expect(page.get_by_role('heading',level=1)).to_have_text('Browser workspace '+suffix+'.')
    expect(page.get_by_text('Give the team its first task.',exact=True)).to_be_visible()
    project_url=page.url

    page.get_by_role('button',name='New task',exact=True).first.click()
    dialog.get_by_label('Task title',exact=True).fill('   ')
    dialog.get_by_role('button',name='Create task',exact=True).click()
    expect(dialog.get_by_role('alert')).to_contain_text('nonempty')
    dialog.get_by_label('Task title',exact=True).fill('Connect verified development events')
    dialog.get_by_label('Description',exact=True).fill('Use project-scoped events from the repository.')
    dialog.get_by_label('Assign to',exact=True).select_option('atlas')
    dialog.get_by_role('button',name='Create task',exact=True).click()
    task=page.get_by_role('button',name=re.compile('Connect verified development events'))
    expect(task).to_be_visible()
    task.click()
    dialog.get_by_label('Status',exact=True).select_option('In progress')
    dialog.get_by_role('button',name='Save changes',exact=True).click()
    expect(task).to_contain_text('In progress')
    nav('Office')
    agent=page.get_by_role('button',name='Inspect Atlas, Lead engineer, In progress',exact=True)
    agent.click()
    expect(dialog.get_by_role('button',name=re.compile('Connect verified development events'))).to_be_visible()
    page.keyboard.press('Escape'); expect(agent).to_be_focused()

    # Another independent browser sees the same persisted project without localStorage.
    second_context=browser.new_context(viewport={'width':1280,'height':900})
    second=second_context.new_page();second.on('pageerror',lambda error:errors.append(str(error)))
    second.goto(project_url,wait_until='networkidle')
    expect(second.get_by_role('heading',level=1)).to_contain_text('Browser workspace '+suffix)
    second.get_by_role('navigation').get_by_role('button',name='Tasks',exact=True).click()
    expect(second.get_by_role('button',name=re.compile('Connect verified development events'))).to_contain_text('In progress')

    # Concurrent edits fail visibly rather than overwriting newer work.
    nav('Tasks');page.get_by_role('button',name=re.compile('Connect verified development events')).click()
    second.get_by_role('button',name=re.compile('Connect verified development events')).click()
    second.get_by_role('dialog').get_by_label('Status',exact=True).select_option('In review')
    second.get_by_role('dialog').get_by_role('button',name='Save changes',exact=True).click()
    dialog.get_by_label('Status',exact=True).select_option('Complete')
    dialog.get_by_role('button',name='Save changes',exact=True).click()
    expect(dialog.get_by_role('alert')).to_contain_text('another session')
    page.keyboard.press('Escape')
    page.get_by_role('button',name='Refresh project',exact=True).click()
    expect(page.get_by_role('button',name=re.compile('Connect verified development events'))).to_contain_text('In review')

    nav('Deliverables');page.get_by_role('button',name='Add note',exact=True).click()
    dialog.get_by_label('Note title',exact=True).fill('Event ingestion decision')
    dialog.get_by_label('Note content',exact=True).fill('Save verified events before publishing updates.\nKeep project scope explicit.')
    dialog.get_by_label('Related task (optional)',exact=True).select_option(label='Connect verified development events')
    dialog.get_by_role('button',name='Save note',exact=True).click()
    page.get_by_role('button',name=re.compile('Event ingestion decision')).click()
    expect(dialog.get_by_text(re.compile('Save verified events before publishing updates.'))).to_be_visible()
    page.keyboard.press('Escape')

    nav('Support');page.get_by_role('button',name='New ticket',exact=True).click()
    dialog.get_by_label('Subject',exact=True).fill('Review the integration boundary')
    dialog.get_by_label('Message',exact=True).fill('Please keep manual updates separate from agent telemetry.')
    dialog.get_by_role('button',name='Save ticket',exact=True).click()
    page.get_by_role('button',name=re.compile('Review the integration boundary')).click()
    expect(page.get_by_text('Please keep manual updates separate from agent telemetry.',exact=True)).to_be_visible()
    page.reload(wait_until='networkidle');nav('Support')
    expect(page.get_by_role('button',name=re.compile('Review the integration boundary'))).to_be_visible()
    nav('Activity');expect(page.get_by_text('Project note added: Event ingestion decision',exact=True)).to_be_visible()

    # New project starts empty; switching back returns its own records.
    first_id=page.get_by_label('Current project',exact=True).input_value()
    page.get_by_role('button',name='New project',exact=True).click()
    dialog.get_by_label('Project name',exact=True).fill('Separate browser project '+suffix)
    dialog.get_by_role('button',name='Create project',exact=True).click()
    expect(page.get_by_text('Give the team its first task.',exact=True)).to_be_visible()
    expect(page.get_by_role('button',name=re.compile('Connect verified development events'))).to_have_count(0)
    page.get_by_label('Current project',exact=True).select_option(first_id)
    expect(page.get_by_role('button',name=re.compile('Connect verified development events'))).to_be_visible()

    # Search/filter and responsive layouts.
    page.get_by_label('Search tasks',exact=True).fill('unmatched')
    expect(page.get_by_text('No matching tasks',exact=True)).to_be_visible()
    page.get_by_label('Search tasks',exact=True).fill('')
    page.get_by_label('Filter tasks by status',exact=True).select_option('Complete')
    expect(page.get_by_text('No matching tasks',exact=True)).to_be_visible()
    page.get_by_label('Filter tasks by status',exact=True).select_option('All')
    for width in [320,390,600,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for tab in ['Tasks','Activity','Deliverables','Support','Office']:
            nav(tab)
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),f'{tab} overflows at {width}px'
    page.emulate_media(reduced_motion='reduce')
    assert page.locator('.station-active .avatar').first.evaluate('(el)=>getComputedStyle(el,"::after").animationName')=='none'

    # Failed saves preserve input and do not create local-only success states.
    page.route('**/api/**',lambda route:route.abort())
    page.get_by_role('button',name='New task',exact=True).first.click()
    dialog.get_by_label('Task title',exact=True).fill('Unsaved offline task')
    dialog.get_by_role('button',name='Create task',exact=True).click()
    expect(dialog.get_by_role('alert')).to_contain_text('unavailable')
    expect(dialog.get_by_label('Task title',exact=True)).to_have_value('Unsaved offline task')
    page.keyboard.press('Escape')
    expect(page.get_by_text('Updates paused',exact=True)).to_be_visible(timeout=8000)
    page.unroute('**/api/**');page.get_by_role('button',name='Retry',exact=True).click()
    expect(page.get_by_text('Database connected',exact=True)).to_be_visible()
    nav('Tasks');expect(page.get_by_role('button',name=re.compile('Unsaved offline task'))).to_have_count(0)
    assert not errors,errors
    print('PASS: workspace-first UI, project/task creation, validation, assignments, status edits, agent inspection, independent browser persistence, concurrent edit protection, linked notes, persisted tickets, activity, project separation, filtering, 320–1440px layouts, reduced motion, and offline save/recovery; no browser runtime errors.')
    browser.close()
