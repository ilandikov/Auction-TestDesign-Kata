import { AuctionEventListener } from './AuctionEventListener';

export class AuctionMessageTranslator {
    private readonly listener: AuctionEventListener;

    constructor(listener: AuctionEventListener) {
        this.listener = listener;
    }

    public processMessage(message: string) {
        if (message.includes('CLOSE')) {
            this.listener.auctionClosed();
        } else if (message.includes('PRICE')) {
            const data: { [key: string]: string } = {};
            message
                .split(';')
                .filter((element) => element.includes(':'))
                .forEach((element) => {
                    const pair = element.split(':');
                    data[pair[0].trim()] = pair[1].trim();
                });

            const currentPrice = parseInt(data['CurrentPrice']);
            const increment = parseInt(data['Increment']);
            const bidder = data['Bidder'];

            this.listener.priceUpdate(currentPrice);
        } else {
            // bug: should notify listener
        }
    }
}
