import { AuctionMessageTranslator } from '../src/AuctionMessageTranslator';
import { AuctionEventListener } from '../src/AuctionEventListener';

class MockAuctionEventListener implements AuctionEventListener {
    public priceUpdater = jest.fn();
    public actionCloser = jest.fn();

    auctionClosed(): void {
        this.actionCloser();
    }

    priceUpdate(currentPrice: number): void {
        this.priceUpdater(currentPrice);
    }
}

describe('AuctionMessageTranslator tests', () => {
    it('should notify auction closed when close message received', () => {
        const message = 'SOLVersion: 1.1; Event: CLOSE;';
        const mockListener = new MockAuctionEventListener();
        const translator = new AuctionMessageTranslator(mockListener);

        translator.processMessage(message);

        expect(mockListener.actionCloser).toHaveBeenCalledTimes(1);
    });

    it('should notify bid details when price message received', () => {
        const message = 'SOLVersion: 1.1; Event: PRICE; CurrentPrice: 192; Increment: 7; Bidder: Someone else;';
        const mockListener = new MockAuctionEventListener();
        const translator = new AuctionMessageTranslator(mockListener);

        translator.processMessage(message);

        expect(mockListener.priceUpdater).toHaveBeenCalledTimes(1);
        expect(mockListener.priceUpdater).toHaveBeenCalledWith(192);
    });
});
