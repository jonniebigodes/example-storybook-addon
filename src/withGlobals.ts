import type {
  Renderer,
  PartialStoryFn as StoryFunction,
  StoryContext,
} from "@storybook/types";
import { useEffect, useMemo, useGlobals } from "@storybook/preview-api";
import { PARAM_KEY } from "./constants";

import { clearStyles, addOutlineStyles } from "./helpers";

import outlineCSS from "./outlineCSS";
export const withGlobals = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>
) => {
  const [globals] = useGlobals();

  const isActive = [true, "true"].includes(globals[PARAM_KEY]);

  // Is the addon being used in the docs panel
  const isInDocs = context.viewMode === "docs";

  const outlineStyles = useMemo(() => {
    const selector = isInDocs
      ? `#anchor--${context.id} .docs-story`
      : ".sb-show-main";

    return outlineCSS(selector);
  }, [context.id]);

  /*  useEffect(() => {
    // Execute your side effect here
    // For example, to manipulate the contents of the preview
    const selector = isInDocs
      ? `#anchor--${context.id} .sb-story`
      : "#storybook-root";

    displayToolState(selector, {
      myAddon,
      isInDocs,
      theme,
    });
  }, [myAddon, theme]); */
  useEffect(() => {
    const selectorId = isInDocs ? `my-addon-docs-${context.id}` : `my-addon`;

    if (!isActive) {
      clearStyles(selectorId);
      return;
    }

    addOutlineStyles(selectorId, outlineStyles);

    return () => {
      clearStyles(selectorId);
    };
  }, [isActive, outlineStyles, context.id]);

  return StoryFn();
};

function displayToolState(selector: string, state: any) {
  const rootElements = document.querySelectorAll(selector);

  rootElements.forEach((rootElement) => {
    let preElement = rootElement.querySelector<HTMLPreElement>(
      `${selector} pre`
    );

    if (!preElement) {
      preElement = document.createElement("pre");
      preElement.style.setProperty("margin-top", "2rem");
      preElement.style.setProperty("padding", "1rem");
      preElement.style.setProperty("background-color", "#eee");
      preElement.style.setProperty("border-radius", "3px");
      preElement.style.setProperty("max-width", "600px");
      preElement.style.setProperty("overflow", "scroll");
      rootElement.appendChild(preElement);
    }

    preElement.innerText = `This snippet is injected by the withGlobals decorator.
It updates as the user interacts with the ⚡ or Theme tools in the toolbar above.

${JSON.stringify(state, null, 2)}
`;
  });
}
