import { test, expect } from "@playwright/test";

/** CSS Selectors */
const CAROUSEL = `[class*="Carousel_container"]`;
const CAROUSEL_ITEM = `div[class*="CarouselSliderItem_item"]`;
const CAROUSEL_ITEM_PART = `span[class*="Carousel_part"]`;
const CAROUSEL_ITEM_DURATION = `span[class*="Carousel_duration"]`;
const CAROUSEL_INFO_TITLE = `div[class*="Carousel_expander"] h3`;

test.setTimeout(1000 * 60 * 5); // 5 minutes (default is 30 seconds)

test("Should have all the thumbnails saved", async ({ page }) => {
  await page.goto("https://onepace.net/watch");
  await page.addStyleTag({
    content: `
      /* Force the carousel to display all items. */
      [class*="CarouselSlider_sliderContent"] {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }

      /* Force the carousel items to display in a large manner. */
      ${CAROUSEL_ITEM} {
        width: 756px !important;
      }

      /* Force the font size of the arc number and duration to be large. */
      ${CAROUSEL_ITEM} span {
        font-size: 64px;
        padding: 0.5rem 1rem;
      }

      /* Force the arc number to display on the left. */
      ${CAROUSEL_ITEM_PART} {
        right: unset;
        left: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 1rem;
      }

      /* Fix border radius for the duration. */
      ${CAROUSEL_ITEM_DURATION} {
        border-top-left-radius: 1rem;
        bottom: 0;
      }
      
      /* Hide the header and the scroller. */
      [class*="CarouselSlider_scroller"], [class*="Header_container"] {
        display: none;
      }
    `,
  });

  // Grab the first carousel and its items.
  const carousel = page.locator(CAROUSEL).nth(0);
  const carouselItem = carousel.locator(CAROUSEL_ITEM);

  // Iterate through each carousel item and take a screenshot.
  for (const arcItem of await carouselItem.all()) {
    await arcItem.scrollIntoViewIfNeeded();

    // Select the arc item and grab the title.
    await arcItem.click();
    let arcTitle = await page.locator(CAROUSEL_INFO_TITLE).innerText();
    arcTitle = arcTitle.replace(/'/g, "").replace(/\s+/, "-").toLowerCase();

    // Deselect the arc item and wait for the animation to go away.
    await arcItem.click();
    await page.waitForTimeout(2500);

    // Grab the arc number and take a screenshot.
    const arcNumber = await arcItem.locator(CAROUSEL_ITEM_PART).innerText();
    await expect(arcItem).toHaveScreenshot(`${arcNumber}-${arcTitle}.png`);
  }
});
