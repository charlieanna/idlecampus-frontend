import { TinyUrlChallenge } from './pages/TinyUrlChallenge';

/**
 * System Design Builder Entry Point
 *
 * For now, this directly loads the TinyURL challenge page.
 * In the future, this can be expanded to a router with multiple challenges.
 */
export default function SystemDesignBuilder() {
  return <TinyUrlChallenge />;
}
