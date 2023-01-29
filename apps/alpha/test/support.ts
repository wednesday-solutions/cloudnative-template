import FastifyServer from '../src/bootstrapper';

/**
 * Test server which extends the original server and can contain
 * more methods for debugging!
 */
export class TestFastifyServer extends FastifyServer {
  /**
   * Closes the server will also fire the `onClose` hook
   */
  async closeServer() {
    await this.instance.close();
  }
}

