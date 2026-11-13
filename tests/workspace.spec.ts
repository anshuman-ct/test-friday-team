import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Let’s make progress.' })).toBeVisible();
});

test('create, edit, complete, persist and delete a project task', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('button', { name: 'New project', exact: true }).click();
  await page.getByLabel('Project name', { exact: true }).fill('Launch checklist');
  await page.getByLabel('Description', { exact: true }).fill('Everything we need to ship.');
  await page.getByLabel('Due date', { exact: true }).fill('2026-12-20');
  await page.getByRole('dialog').getByRole('button', { name: 'Create project', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Launch checklist', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'New task', exact: true }).click();
  await page.getByLabel('Task name', { exact: true }).fill('Prepare release');
  await page.getByLabel('Priority', { exact: true }).selectOption('High');
  await page.getByLabel('Due date', { exact: true }).fill('2026-12-19');
  await page.getByRole('dialog').getByRole('button', { name: 'Create task', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Prepare release', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Prepare release', exact: true }).click();
  await page.getByLabel('Task name', { exact: true }).fill('Prepare final release');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByLabel('Status for Prepare final release', { exact: true }).selectOption('In progress');
  await page.getByRole('button', { name: 'Complete Prepare final release', exact: true }).click();
  await expect(page.getByLabel('Status for Prepare final release')).toHaveValue('Done');
  await page.reload();
  await page.getByRole('button', { name: 'Launch checklist', exact: true }).click();
  await expect(page.getByLabel('Status for Prepare final release')).toHaveValue('Done');
  await page.getByRole('button', { name: 'Board', exact: true }).click();
  await expect(page.locator('.board-column').filter({ has: page.getByRole('heading', { name: /^Done/ }) })).toContainText('Prepare final release');
  await page.getByRole('button', { name: 'Activity', exact: true }).click();
  await expect(page.locator('.activity-feed')).toContainText('Prepare final release');
  await page.getByRole('button', { name: 'Launch checklist', exact: true }).click();
  await page.getByRole('button', { name: 'Prepare final release', exact: true }).click();
  await page.getByRole('button', { name: 'Delete task', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Prepare final release', exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('search, filter, team assignments and workspace preferences', async ({ page }) => {
  await page.getByRole('button', { name: 'Projects', exact: true }).click();
  await page.getByLabel('Search projects').fill('brand');
  await expect(page.locator('.project-card')).toHaveCount(1);
  await page.getByLabel('Search projects').fill('no matching name');
  await expect(page.getByText('No projects found')).toBeVisible();
  await page.getByRole('button', { name: /^Tasks/ }).click();
  await page.getByLabel('Filter status').selectOption('Done');
  await expect(page.locator('tbody tr')).toHaveCount(4);
  await page.getByRole('button', { name: 'Team', exact: true }).click();
  await expect(page.locator('.member-card')).toHaveCount(4);
  await page.locator('.member-card').filter({ hasText: 'Jamie Chen' }).getByRole('button', { name: /View assigned tasks/ }).click();
  await expect(page.locator('tbody tr')).toHaveCount(3);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByLabel('Workspace name', { exact: true }).fill('Studio Orion');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.reload();
  await expect(page.locator('.workspace-switch')).toContainText('Studio Orion');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export workspace' }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('orion-workspace.json');
  await page.getByRole('button', { name: 'Reset demo data' }).click();
  await page.getByRole('button', { name: 'Confirm reset' }).click();
  await expect(page.locator('.workspace-switch')).toContainText('Orion workspace');
});

test('mobile navigation, modal keyboard handling and contained layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Projects', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'New project', exact: true }).click();
  await expect(page.getByLabel('Project name', { exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: /^Tasks/ }).click();
  await page.getByRole('button', { name: 'Board', exact: true }).click();
  await expect(page.getByRole('heading', { name: /^To do/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
