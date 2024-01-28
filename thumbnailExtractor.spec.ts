import { test, expect, type Page } from "@playwright/test";

test("Should have all the thumbnails saved", async ({ page }) => {
  await page.goto("https://onepace.net/watch");
  await page.addStyleTag({
    content: `
      [class*="Carousel_part"] {
        right: unset;
        left: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 1rem;
      }

      [class*="CarouselSlider_scroller"], [class*="Header_container"] {
        display: none;
      }

      [class*="CarouselSliderItem_item"] {
        width: 756px !important;
      }

      [class*="CarouselSliderItem_item"] span {
        font-size: 64px;
        padding: 0.5rem 1rem;
      }

      [class*="Carousel_root"] {
        display: flex;
        flex-wrap: wrap;
      }

      [class*="Carousel_duration"] {
        border-top-left-radius: 1rem;
      }
    `,
  });

  const carousel = page.locator(`[class*="Carousel_container"]`).nth(0);
  // prettier-ignore
  const carouselItem = carousel.locator(`div[class*="CarouselSliderItem_item"]`);

  const itemCount = await carouselItem.count();
  for (let i = 0; i < itemCount; i++) {
    await expect(carouselItem.nth(i)).toHaveScreenshot(`arc-${i + 1}.png`, {
      scale: "device",
    });
  }

  await page.waitForTimeout(2000);
});
