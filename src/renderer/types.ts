import { Snippets } from "../types";

/**
 * Defines the renderer contract. The renderer is responsible for saving the
 * extracted snippets in a desired format or target (e.g. markdown files).
 */
export interface Renderer {
  render(snippets: Snippets): Promise<void>;
}
