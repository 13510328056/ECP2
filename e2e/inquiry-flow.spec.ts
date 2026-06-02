import { test, expect } from '@playwright/test'

test.describe('Inquiry Flow', () => {
  test('submit an inquiry via contact form', async ({ page }) => {
    // 1. Navigate to contact page
    await page.goto('/#/contact')
    await expect(page.locator('#app')).toBeVisible()

    // 2. Fill in the inquiry form
    const nameInput = page.locator('input[placeholder*="姓名"], input[placeholder*="Name"], input[name="name"]').first()
    const emailInput = page.locator('input[placeholder*="邮箱"], input[placeholder*="Email"], input[name="email"]').first()
    const phoneInput = page.locator('input[placeholder*="电话"], input[placeholder*="Phone"], input[name="phone"]').first()
    const messageInput = page.locator('textarea[placeholder*="消息"], textarea[placeholder*="Message"], textarea[name="message"], textarea[placeholder*="内容"]').first()

    await nameInput.fill('John Mensah')
    await emailInput.fill('john.mensah@example.com')
    await phoneInput.fill('+233 24 123 4567')

    // Select subject if dropdown exists
    const subjectSelect = page.locator('select[name="subject"], select[placeholder*="主题"], select[placeholder*="Subject"]').first()
    if (await subjectSelect.isVisible()) {
      await subjectSelect.selectOption('product')
    }

    await messageInput.fill('I am interested in purchasing heavy-duty rock drilling equipment for my mining operation in Tarkwa. Please provide pricing and delivery information.')

    // 3. Submit the form
    const submitBtn = page.locator('button[type="submit"], text=提交, text=Send, text=发送, text=Submit').first()
    await expect(submitBtn).toBeVisible({ timeout: 5000 })
    await submitBtn.click()

    // 4. Verify success message
    const successMsg = page.locator('text=成功, text=Success, text=已发送, text=谢谢, text=Thank you, text=已提交').first()
    await expect(successMsg).toBeVisible({ timeout: 5000 })
  })

  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto('/#/contact')
    await expect(page.locator('#app')).toBeVisible()

    // Try submitting with empty form
    const submitBtn = page.locator('button[type="submit"], text=提交, text=Send, text=Submit').first()
    await submitBtn.click()

    // Verify validation errors appear
    const errorMsg = page.locator('text=必填, text=Required, text=不能为空, .error, .validation-error, .text-red').first()
    await expect(errorMsg).toBeVisible({ timeout: 5000 })
  })
})
