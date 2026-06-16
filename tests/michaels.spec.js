const { test, expect } = require('@playwright/test');

const baseUrl = 'https://www.michaels.com';

test('open michaels homepage and click sign in', async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page).toHaveURL(/https:\/\/www\.michaels\.com/);
  await expect(page).toHaveTitle(/Michaels/i);

  await page.locator('div[role="button"]:has-text("Sign In")').first().click();
  const popoverSignInLink = page.locator('a[href^="/signin"]', { hasText: 'Sign In' }).first();
  await expect(popoverSignInLink).toBeVisible({ timeout: 10000 });

  await popoverSignInLink.click();
  await page.waitForURL(/\/signin/, { timeout: 60000 });
  await expect(page.locator('input, button').first()).toBeVisible({ timeout: 60000 });

  //await page.click('a[href^="/signup"]:has-text("Create an Account")');
}, { timeout: 60000 });

test('search for an item', async ({ page }) => {
  //go to hompage 
  await page.goto(baseUrl);
  //search an item
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');
  //await page.waitForTimeout(10000);
}, { timeout: 60000 });

test('browse mylar foil balloons category', async ({ page }) => {
  await page.goto(baseUrl);
  const categoryUrl = baseUrl + '/shop/party/balloons-accessories/mylar-foil-balloons';

  await page.goto(categoryUrl);
  await expect(page).toHaveURL(/mylar-foil-balloons/);
  await expect(page.locator('h1, h2').first()).toBeVisible();
  await expect(page).toHaveTitle(/balloon|mylar|foil/i);
}, { timeout: 60000 });

test('click Shop menu from homepage and open The Party Shop', async ({ page }) => {
  await page.goto(baseUrl);
  const shopButton = page.locator('p.chakra-text:has-text("Shop")').first();
  await expect(shopButton).toBeVisible();
  await shopButton.click();

  const partyShopLink = page.locator('div.chakra-popover__body a[href="/shop/party"]', { hasText: 'The Party Shop' }).first();
  await expect(partyShopLink).toBeVisible({ timeout: 10000 });
  await partyShopLink.scrollIntoViewIfNeeded();

  await partyShopLink.click();
  await page.waitForURL(/\/shop\/party/, { timeout: 60000 });
  await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 60000 });
});

test('click on the first item in the search results and verify product details', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  const firstProductLink = page.locator('a[href^="/product/"] h3').first();
  
  await expect(firstProductLink).toBeVisible({ timeout: 30000 });
  
  await firstProductLink.click();

  await page.waitForURL(/\/product\//, { timeout: 60000 });
  const productTitle = page.locator('h1, h2').first();
  await expect(productTitle).toBeVisible({ timeout: 60000 });
  await expect(productTitle).not.toBeEmpty();
});

test('click on the second item in the search results and verify product details', async ({ page }) => {
  await page.goto(baseUrl);

  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  //await page.waitForLoadState('networkidle');

  const products = page.locator('a[href^="/product/"] h3');

  await products.first().waitFor();

  const count = await products.count();
  

  const productname = '12 Pack: Gildan® Short Sleeve Adult T-Shirt';

  for (let i = 0; i < count; i++) {
    const title = await products.nth(i).innerText();

    

    if (title.trim() === productname) {
      

      await products.nth(i).click();
      await page.waitForLoadState('load');

      break;
    }
  }
});

test('Sorting search results by price high to low', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  await page.locator('//button[contains(@class,"SortByDropdown_menuButton")]').click();
  await page.getByText('Price: High to Low').click();
  await page.waitForTimeout(5000);
});


test('check pagination on search results', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  await page.locator('a[href^="/product/"] h3').first().waitFor();
  await page.locator('button[aria-label="Page 2"]').scrollIntoViewIfNeeded();

  
  await page.locator('button[aria-label="Page 2"]').click();

  await expect(
  page.locator('button[aria-label="Page 2"]')
  ).toHaveAttribute('aria-current', 'page');

  
  await page.pause();
});

test('check filter functionality: Sales & Offers: Great Buy', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  await page.locator('a[href^="/product/"] h3').first().waitFor();
  await page.locator("//input[@aria-label='Sales & Offers: Great Buy']").check();
  
  await page.pause();
});

test(' Selecting second option under the product image ', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  await page.locator('a[href^="/product/"] h3').first().waitFor();
  // const whiteButton = page.locator("//button[@aria-label='Select White']");

  // await whiteButton.click();

  // await expect(whiteButton).toBeVisible();
  await firstProduct
  .locator('button[aria-label^="Select"]')
  .nth(1)
  .click();
  // const count = await page.locator("//button[@aria-label='Select Sport Gray']").count();

  
  await page.pause();
});

test('Adding the product to the cart from product description page', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  await page.locator('a[href^="/product/"] h3').first().waitFor();
  await page.locator('a[href^="/product/"] h3').first().click();
  await page.waitForURL(/\/product\//);

  await page.locator("button:has-text('Add to Cart')").click();
  //await page.locator("//button[@id='Add-to-Cart']").click();

  // const cartCount = page.locator('span[aria-label="Cart Count"]');
  // await expect(cartCount).toHaveText('1');

  await page.pause();
});

test('check multiple filter functionality', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  await page.locator('a[href^="/product/"] h3').first().waitFor();
  await page.locator("//input[@aria-label='Sales & Offers: Sale']").check();
  
  await page.waitForTimeout(2000);
  await page.locator("//input[@aria-label='Sales & Offers: New']").check();
  
  await page.waitForTimeout(2000);
  await page.locator("//label[@for='filter-refinementcolor-Black']").click();
  
  await page.waitForTimeout(2000);
  await page.locator("//label[@for='filter-retailers-Michaels']").click();
  
  await page.pause();
});
 
test('check view option functionality', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  const firstProductLink = page.locator('a[href^="/product/"] h3').first();
  await expect(firstProductLink).toBeVisible({ timeout: 30000 });
 
  const viewOptions = page.getByRole('button', { name: 'View Options' });

  await expect(viewOptions.first()).toBeVisible();
  await viewOptions.first().click();

  await page.pause();
});

test('check all the details for a card', async ({ page }) => {
  await page.goto(baseUrl);
  await page.fill('input[aria-label="Search Input"]', 'tshirt');
  await page.click('button[aria-label="Search Button"]');

  const firstProductLink = page.locator('a[href^="/product/"] h3').first();
  await expect(firstProductLink).toBeVisible({ timeout: 30000 });
  
  const name = await firstProductLink.innerText();
  

  // IMPORTANT: rating is outside <a>, so go to parent card
  const card = firstProductLink.locator('xpath=ancestor::div[contains(@class,"p-2")]');

  const ratingLink = page.locator(
  'a[aria-label*="out of 5 stars"]'
  ).first();

  const ariaLabel = await ratingLink.getAttribute('aria-label');

  
  // For product card price 
  const firstPrice = await page.locator('span.font-bold.leading-6.text-gray-900').nth(0).textContent();
  
  
});

// test.only('check the delivery information for a product', async ({ page }) => {
//   await page.goto(baseUrl);
//   await page.fill('input[aria-label="Search Input"]', 'tshirt');
//   await page.click('button[aria-label="Search Button"]');

//   const firstProductLink = page.locator('a[href^="/product/"] h3').first();
//   await expect(firstProductLink).toBeVisible({ timeout: 30000 });
//   
  
//   const storePickup = page.locator("//span[text()='Store Pickup']").first();
//   await page.locator('.store-name-display').count().then(count => {
//     
//   });
//   await expect(storePickup).toBeVisible();

//   const storeName = page.locator(
//   "//span[text()='Store Pickup']/following::span[contains(@class,'store-name-display')][1]"
//   ).first();


// });

test('Print all option names and their links from the home page ', async ({ page }) => {
  await page.goto(baseUrl);
  
  const menuItems = await page.locator('nav a').evaluateAll(elements =>
    elements.map(el => ({
      name: el.textContent?.trim(),
      link: el.href
    }))
  );

  for (const item of menuItems) {

    if (!item.name ||
        item.name === 'Shop' ||
        item.name.includes('Shop All')) {
      continue;
    }


  }
});

test('Go to cart page from home page and then click on signin page from cart page ', async ({ page }) => {
  await page.goto(baseUrl);
  await page.click('a[href="/cart"]');
  await page.waitForURL(/\/cart/, { timeout: 60000 });
  // await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 60000 });

  await page.locator('div[role="button"]:has-text("Sign In")').click();
  const popoverSignInLink = page.locator('a:has-text("Sign In")').nth(1);
  await expect(popoverSignInLink).toBeVisible({ timeout: 10000 });

  await popoverSignInLink.click();  
  await page.waitForURL(/\/signin/, { timeout: 60000 });
  await expect(page.locator('input, button').first()).toBeVisible({ timeout: 60000 });
  await page.pause();
});

test.only('check placeholder text for search input', async ({ page }) => {
  await page.goto("https://www.michaels.com/signin?returnUrl=/&headerAuthCta=true");
  await page.getByLabel('Email Address').fill('sayanprod@snapmail.cc');
  await page.getByLabel('Password').fill('Test1234');
  await page.getByRole('button', { name: 'SIGN IN' }).click();
  //await page.getByRole('button', { name: 'Sign Out' }).click();
  
  
  await page.pause();
});