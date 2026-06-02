import { test, expect } from '@playwright/test'

test.describe('Admin Flow', () => {
  test('admin login, view dashboard, products, orders, inquiries, and logout', async ({ page }) => {
    // 1. Navigate to admin login
    await page.goto('/#/admin/login')
    await expect(page.locator('#app')).toBeVisible()

    // 2. Login with admin credentials
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="Email"]').first()
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="密码"], input[placeholder*="Password"]').first()

    await emailInput.fill('admin@lisindustrial.gh')
    await passwordInput.fill('admin123')

    const loginBtn = page.locator('button[type="submit"], text=登录, text=Login').first()
    await loginBtn.click()

    // 3. View dashboard
    await expect(page).toHaveURL(/#\/admin\/dashboard/)
    await expect(page.locator('text=仪表板, text=Dashboard, text=控制台')).toBeVisible({ timeout: 5000 })

    // 4. View product list
    const productsLink = page.locator('text=产品管理, text=Products, text=商品管理').first()
    if (await productsLink.isVisible()) {
      await productsLink.click()
      await expect(page).toHaveURL(/#\/admin\/products/)
    }

    // 5. View order list
    const ordersLink = page.locator('text=订单管理, text=Orders, text=订单').first()
    if (await ordersLink.isVisible()) {
      await ordersLink.click()
      await expect(page).toHaveURL(/#\/admin\/orders/)
    }

    // 6. View inquiry list
    const inquiriesLink = page.locator('text=询盘管理, text=Inquiries, text=咨询').first()
    if (await inquiriesLink.isVisible()) {
      await inquiriesLink.click()
      await expect(page).toHaveURL(/#\/admin\/inquiries/)
    }

    // 7. Logout
    const logoutBtn = page.locator('text=退出登录, text=Logout, text=退出').first()
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click()
    }

    // Verify redirected to admin login
    await expect(page).toHaveURL(/#\/admin\/login/)
  })
})
