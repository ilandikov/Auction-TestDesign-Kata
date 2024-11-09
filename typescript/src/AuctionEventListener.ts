export interface AuctionEventListener {
    auctionClosed(): void;

    priceUpdate(currentPrice: number): void;

    setReservePrice(number: number): void;
}
