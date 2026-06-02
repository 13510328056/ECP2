import { test, expect } from '@playwright/test'

test.describe('Buyer Journey', () => {
  test('complete buyer journey: browse, add to cart, checkout, and order confirmation', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('/')
    await expect(page.locator('#app')).toBeVisible()

    // 2. Navigate to products page via bottom nav
    await page.click('text=分类')
    await expect(page).toHaveURL(/#\/products/)

    // 3. Click on a product card to view details
    const productCard = page.locator('.product-card').first()
    await expect(productCard).toBeVisible({ timeout: 5000 })
    await productCard.click()

    // Should be on a product detail page
    await expect(page).toHaveURL(/#\/product\//)

    // 4. Add to cart
    const addToCartBtn = page.locator('text=加入购物车').or(page.locator('text=Add to Cart'))
    await expect(addToCartBtn).toBeVisible({ timeout: 5000 })
    await addToCartBtn.click()

    // 5. Navigate to cart
    await page.click('text=购物车')
    await expect(page).toHaveURL(/#\/cart/)
    await expect(page.locator('.cart-item, .cart-item-row, .cart__item')).toBeVisible({ timeout: 5000 })

    // 6. Proceed to checkout
    const checkoutBtn = page.locator('text=结算').or(page.locator('text=Checkout')).or(page.locator('text=去结算'))
    await expect(checkoutBtn).toBeVisible({ timeout: 5000 })
    await checkoutBtn.click()
    await expect(page).toHaveURL(/#\/checkout/)

    // 7. Fill in shipping information
    const fullNameInput = page.locator('input[placeholder*="姓名"], input[placeholder*="Name"], input[name="fullName"], input[name="full_name"]').first()
    const phoneInput = page.locator('input[placeholder*="电话"], input[placeholder*="Phone"], input[name="phone"]').first()
    const addressInput = page.locator('input[placeholder*="地址"], input[placeholder*="Address"], input[name="address"]').first()
    const cityInput = page.locator('input[placeholder*="城市"], input[placeholder*="City"], input[name="city"]').first()

    await fullNameInput.fill('John Mensah')
    await phoneInput.fill('+233 24 123 4567')
    await addressInput.fill('Plot 45, Industrial Road, Tema')
    await cityInput.fill('Tema')

    // 8. Submit order
    const submitOrderBtn = page.locator('text=提交订单').or(page.locator('text=Submit Order')).or(page.locator('text=确认下单'))
    await expect(submitOrderBtn).toBeVisible({ timeout: 5000 })
    await submitOrderBtn.click()

    // 9. Enter MOMO PIN on payment page
    await expect(page).toHaveURL(/#\/payment/)
    const momoPinInput = page.locator('input[type="password"], input[placeholder*="PIN"], input[name="pin"]').first()
    if (await momoPinInput.isVisible()) {
      await momoPinInput.fill('0000')
    }

    const payBtn = page.locator('text=支付').or(page.locator('text=Pay')).or(page.locator('text=确认支付'))
    if (await payBtn.isVisible()) {
      await payBtn.click()
    }

    // 10. Verify order confirmation
    await expect(page).toHaveURL(/#\/order-confirmation/)
  })
})
