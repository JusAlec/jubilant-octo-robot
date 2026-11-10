"""Browser checks. Requires Python Playwright and a local Chromium installation.
Run a QR8 dev/preview server, then: python scripts/browser-smoke.py
Set QR8_TEST_URL to target another local server; no customer services are called.
"""
import os
import re
from playwright.sync_api import sync_playwright, expect

url = os.environ.get('QR8_TEST_URL', 'http://127.0.0.1:5173/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    assert page.goto(url, wait_until='networkidle').status == 200
    expect(page.get_by_role('heading', level=1)).to_contain_text('One shared office.')
    expect(page.get_by_text('DEMO REPLAY', exact=True)).to_be_visible()
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')

    # Opening a native dialog pauses the replay, traps focus, and restores its trigger.
    agent = page.get_by_role('button', name=re.compile('Inspect Sage,'))
    agent.click()
    expect(page.get_by_role('dialog')).to_be_visible()
    expect(page.get_by_role('dialog').get_by_role('heading', name='Sage', exact=True)).to_be_visible()
    expect(page.get_by_role('dialog').get_by_text('Build the interactive workspace', exact=True)).to_be_visible()
    page.keyboard.press('Escape')
    expect(page.get_by_role('dialog')).to_have_count(0)
    expect(agent).to_be_focused()

    # Reset, play, pause, speed, and seek all affect the projected task state.
    page.get_by_role('button', name='Restart replay').click()
    slider = page.get_by_role('slider', name='Replay position')
    expect(slider).to_have_value('0')
    page.get_by_role('button', name=re.compile('Playback speed 1')).click()
    page.get_by_role('button', name='Play replay', exact=True).click()
    expect(slider).not_to_have_value('0', timeout=4000)
    page.get_by_role('button', name='Pause replay', exact=True).click()
    paused = slider.input_value()
    page.wait_for_timeout(1500)
    expect(slider).to_have_value(paused)
    slider.fill('11')
    page.get_by_role('tab', name='Tasks').click()
    expect(page.get_by_text('3 of 4 complete in this replay')).to_be_visible()
    page.get_by_role('button', name=re.compile('QR8-004')).click()
    expect(page.get_by_role('dialog').get_by_role('heading', name='Release scope')).to_be_visible()
    page.get_by_role('button', name='Close details').click()
    page.get_by_role('tab', name='Activity', exact=True).click()
    expect(page.get_by_text('First-build scope is ready for your review.', exact=True)).to_be_visible()
    page.get_by_role('tab', name='Deliverables', exact=True).click()
    expect(page.locator('.artifact-card')).to_have_count(4)

    # Keyboard tab navigation follows the ARIA tab pattern.
    page.get_by_role('tab', name='Office', exact=True).click()
    page.get_by_role('tab', name='Office', exact=True).focus()
    page.keyboard.press('ArrowRight')
    expect(page.get_by_role('tab', name='Tasks')).to_be_focused()
    expect(page.get_by_role('tab', name='Tasks')).to_have_attribute('aria-selected', 'true')

    # Local tickets validate whitespace, persist across reload, and never call an API.
    calls = []
    page.on('request', lambda request: calls.append(request) if request.method != 'GET' else None)
    page.get_by_role('tab', name='Support', exact=True).click()
    page.get_by_label('Subject', exact=True).fill('   ')
    page.get_by_label('Your message', exact=True).fill('   ')
    page.get_by_role('button', name='Save local draft').click()
    expect(page.get_by_role('status')).to_contain_text('Please add a subject')
    page.get_by_label('Subject', exact=True).fill('Smoke test feedback')
    page.get_by_label('Your message', exact=True).fill('Keep the mobile team view easy to inspect.')
    page.get_by_role('button', name='Save local draft').click()
    expect(page.get_by_role('status')).to_contain_text('Nothing was sent')
    page.reload(wait_until='networkidle')
    page.get_by_role('tab', name='Support', exact=True).click()
    ticket = page.get_by_role('button', name=re.compile('Smoke test feedback'))
    ticket.click()
    expect(page.get_by_text('Keep the mobile team view easy to inspect.', exact=True)).to_be_visible()
    assert not calls, 'Support must remain local in phase 1'

    # New mobile sessions default to the readable team view. Both views and all tabs fit.
    mobile_context = browser.new_context(viewport={'width': 390, 'height': 844})
    mobile = mobile_context.new_page()
    mobile.on('pageerror', lambda error: errors.append(str(error)))
    mobile.emulate_media(reduced_motion='reduce')
    mobile.goto(url, wait_until='networkidle')
    expect(mobile.get_by_role('button', name='Team', exact=True)).to_have_attribute('aria-pressed', 'true')
    for tab in ['Office', 'Tasks', 'Activity', 'Deliverables', 'Support']:
        mobile.get_by_role('tab', name=tab, exact=True).click()
        assert not mobile.evaluate('document.documentElement.scrollWidth > innerWidth'), f'{tab} overflows mobile'
    mobile.get_by_role('tab', name='Office', exact=True).click()
    mobile.get_by_role('button', name='Office', exact=True).click()
    assert not mobile.evaluate('document.documentElement.scrollWidth > innerWidth')
    mobile.get_by_role('button', name=re.compile('Inspect Nova,')).click()
    expect(mobile.get_by_role('dialog')).to_be_visible()
    assert mobile.locator('.station-active .avatar').first.evaluate('(el) => getComputedStyle(el, "::after").animationName') == 'none'
    mobile.keyboard.press('Escape')
    for width in [320, 600, 768, 1024]:
        mobile.set_viewport_size({'width': width, 'height': 900})
        assert not mobile.evaluate('document.documentElement.scrollWidth > innerWidth'), f'{width}px overflows'
    assert not errors, errors
    print('PASS: desktop/mobile navigation, dialogs and focus, replay, task evidence, keyboard tabs, local ticket validation/persistence, no support API calls, reduced motion, 320–1440px layout; no browser runtime errors')
    browser.close()
