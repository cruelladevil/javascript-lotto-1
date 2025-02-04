/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
/* eslint-disable */
import './js/css/style.css';
import WebController from '../src/controller/WebController';
import Payment from './js/components/Payment';
import LottoList from './js/components/LottoList';
import WinningInput from './js/components/WinningInput';
import LOTTO from './constants/lotto';
import Modal from './js/components/Modal';
import { validateBonusNumber, validateNumbers, validatePurchaseAmount } from './domain/validator';
import { $, $$ } from './js/dom';

const webController = new WebController();

$('.lotto-container').insertAdjacentHTML('beforeend', Payment());

$('#payment-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const moneyInput = $('.money-input');
  const money = Number(moneyInput.value);

  try {
    validatePurchaseAmount(money);
  } catch (error) {
    alert(error.message);
    return;
  }

  webController.purchaseLotto(money / LOTTO.UNIT);

  mountLottoList();
  mountWinningInput();

  moneyInput.disabled = true;
  $('.purchase-button').disabled = true;
});

const mountLottoList = () => {
  $('.lotto-container').insertAdjacentHTML(
    'beforeend',
    LottoList(webController.getLottosNumbers()),
  );
};

const mountWinningInput = () => {
  $('.lotto-container').insertAdjacentHTML('beforeend', WinningInput());

  const winningForm = $('.winning-form');

  winningForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const winNumbers = [];

    $$('.js-winning-number').forEach((node) => winNumbers.push(Number(node.value)));

    const bonusNumber = Number($('#js-bonus-number').value);

    try {
      validateNumbers(winNumbers);
      validateBonusNumber(winNumbers, bonusNumber);
    } catch (error) {
      alert(error.message);
      return;
    }

    webController.setWinningLotto(winNumbers, bonusNumber);

    mountModal();
  });
};

const mountModal = () => {
  if ($('.modal-window')) return;

  $('#modal').insertAdjacentHTML('beforeend', Modal(webController.getStatstics()));
  $('#modal').style.display = 'flex';

  $('.restart-button').addEventListener('click', restart);
  $('#modal-close-button').addEventListener('click', () => {
    $('#modal').style.display = 'none';
    $('.modal-window').remove();
    document.body.style.overflow = 'visible';
  });

  document.body.style.overflow = 'hidden';
};

const restart = () => {
  $('#modal').style.display = 'none';
  $('.purchase-button').disabled = false;

  const moneyInput = $('.money-input');
  moneyInput.value = '';
  moneyInput.disabled = false;

  $('.modal-window').remove();
  $('.lotto-list-wrapper').remove();
  $('.winning-form').remove();

  document.body.style.overflow = 'visible';
};
