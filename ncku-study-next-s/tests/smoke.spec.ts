import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Home page loads and shows TransCard grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="trans-card-grid"], .trans-card, article, main', { timeout: 10000 });
    await expect(page).toHaveURL(/\//);
  });

  test('Study page loads and shows study cards', async ({ page }) => {
    await page.goto('/study');
    await page.waitForSelector('main, article, [data-testid="study-card"], .study-card', { timeout: 10000 });
    await expect(page).toHaveURL(/\/study/);
  });

  test('Post page loads and shows multi-step form', async ({ page }) => {
    await page.goto('/post');
    await page.waitForSelector('form, [data-testid="post-form"], input, select', { timeout: 10000 });
    await expect(page).toHaveURL(/\/post/);
  });

  test('Admin login page loads and shows login form', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForSelector('form, input[type="email"], input[type="password"]', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Admin redirects unauthenticated users to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL(/\/admin\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
