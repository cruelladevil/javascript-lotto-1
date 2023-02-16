import LottoController from './LottoController';
import InputView from './view/console/InputView';

class App {
  // 고민해볼 것 : 해당 커맨드를 웹 에서는 어떻게 사용할지?, 위치가 컨트롤러로 가야할 지?
  static RESTART_COMMAND = 'y';
  static EXIT_COMMAND = 'n';

  #lottoController;

  constructor() {
    this.#lottoController = new LottoController();
  }

  async play() {
    await this.#lottoController.readMoney();
    this.#lottoController.printBuyLottos();
    await this.#lottoController.readWinNumbers();
    await this.#lottoController.readBonusNumber();
    this.#lottoController.printWinStatistics();
    await this.readRestartCommand();
  }

  async readRestartCommand() {
    const command = await InputView.readRestartCommand();
    this.actionByCommand(command);
  }

  actionByCommand(command) {
    if (command === App.RESTART_COMMAND) {
      this.play();
    }
    if (command === App.EXIT_COMMAND) {
      InputView.close();
    }
  }
}

export default App;
