import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '@/components/ui/button';

test.describe('Button component', () => {
  test('renders button text', async ({ mount }) => {
    const component = await mount(<Button>Submit</Button>);

    await expect(component).toContainText('Submit');
  });

  test('default variant and size', async ({ mount }) => {
    const component = await mount(<Button>Submit</Button>);

    await expect(component).toHaveAttribute('data-variant', 'default');
    await expect(component).toHaveAttribute('data-size', 'default');
  });

  test('outline variant', async ({ mount }) => {
    const component = await mount(<Button variant='outline'>Outline</Button>);

    await expect(component).toHaveAttribute('data-variant', 'outline');
  });

  test('disabled button', async ({ mount }) => {
    const component = await mount(<Button disabled>Disabled</Button>);

    await expect(component).toBeDisabled();
  });

  test('click event works', async ({ mount }) => {
    let clicked = false;

    const component = await mount(<Button onClick={() => (clicked = true)}>Click</Button>);

    await component.click();

    expect(clicked).toBe(true);
  });

  test('asChild renders link', async ({ mount }) => {
    const component = await mount(
      <Button asChild>
        <a href='/dashboard'>Dashboard</a>
      </Button>
    );

    await expect(component).toHaveAttribute('data-slot', 'button');
    await expect(component).toHaveAttribute('href', '/dashboard');
  });
});
