import { AuctionMessageTranslator } from '../src/AuctionMessageTranslator';
import { AuctionEventListener } from '../src/AuctionEventListener';

class MockAuctionEventListener implements AuctionEventListener {
    private expectedCall: string = '';
    private actualCall: string = '';
    private expectedArgument: any;
    expectCall(call: string) {
        this.expectedCall = call;
    }

    auctionClosed(): void {
        this.actualCall = 'AuctionClosed';
    }

    checkExpectations() {
        expect(this.expectedCall).toEqual(this.actualCall);
    }

    expectCallWithArg(call: string, argument: any) {
        this.expectedCall = call;
        this.expectedArgument = argument;
    }

    priceUpdate(currentPrice: number): void {
        this.actualCall = 'PriceUpdate';
        expect(currentPrice).toEqual(this.expectedArgument);
    }
}

describe('AuctionMessageTranslator tests', () => {
    it('should notify auction closed when close message received', () => {
        const message = 'SOLVersion: 1.1; Event: CLOSE;';
        const mockListener = new MockAuctionEventListener();
        mockListener.expectCall('AuctionClosed');
        const translator = new AuctionMessageTranslator(mockListener);

        translator.processMessage(message);

        mockListener.checkExpectations();
    });

    it('should notify bid details when price message received', () => {
        const message = 'SOLVersion: 1.1; Event: PRICE; CurrentPrice: 192; Increment: 7; Bidder: Someone else;';
        const mockListener = new MockAuctionEventListener();
        mockListener.expectCallWithArg('PriceUpdate', 192);
        const translator = new AuctionMessageTranslator(mockListener);

        translator.processMessage(message);

        mockListener.checkExpectations();
    });
});
