export interface CardProps {
  cardNumber: boolean;
  cardExpiry: boolean;
  cardCvc: boolean;
}

export class Card implements CardProps {
  cardNumber: boolean;
  cardExpiry: boolean;
  cardCvc: boolean;

  constructor() {
    this.cardNumber = false;
    this.cardExpiry = false;
    this.cardCvc = false;
  }
}
