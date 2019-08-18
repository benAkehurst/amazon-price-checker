export class Item {
  constructor(
    public id: string,
    public name: string,
    public link: string,
    public imgUrl: string,
    public price: number,
    public targetPrice: number,
    public following: boolean,
    public pastPrices: Array<object>,
    public createdDate: Date,
    public updatedDate: Date
  ) {}
}
