export interface Exito {
    name:      string;
    brandName: string;
    image:     Image[];
    lowPrice:  number;
    discountPercentage: number;
    PriceWithoutDiscount: number
}

export interface Image {
    url:           string;
    alternateName: string;
}


export interface PromosTecnologyExito {
    data: PromosTecnologyExitoData;
}

export interface PromosTecnologyExitoData {
    data: DataData;
}

export interface DataData {
    search: Search;
}

export interface Search {
    products: Products;
}

export interface Products {
    pageInfo: PageInfo;
    edges:    Edge[];
}

export interface Edge {
    node: Node;
}

export interface Node {
    id:                 string;
    slug:               string;
    sku:                string;
    productType:        ProductType;
    brand:              Brand;
    name:               string;
    gtin:               string;
    breadcrumbList:     BreadcrumbList;
    properties:         NodeProperty[];
    isVariantOf:        IsVariantOf;
    items:              Item[];
    productClusters:    ProductCluster[];
    additionalProperty: any[];
    image:              NodeImage[];
    sellers:            ItemSeller[];
    offers:             Offers;
}

export interface Brand {
    brandName: string;
    name:      string;
}

export interface BreadcrumbList {
    itemListElement: ItemListElement[];
}

export interface ItemListElement {
    item:     string;
    name:     string;
    position: number;
}

export interface NodeImage {
    url:           string;
    alternateName: string;
}

export interface IsVariantOf {
    productGroupID: string;
    name:           string;
    skuVariants:    SkuVariants;
}

export interface SkuVariants {
    activeVariations:    ActiveVariations;
    slugsMap:            ActiveVariations;
    availableVariations: ActiveVariations;
}

export interface ActiveVariations {
}

export interface Item {
    complementName:  string;
    ean:             string;
    isKit:           boolean;
    itemId:          string;
    measurementUnit: MeasurementUnit;
    modalType:       string;
    name:            string;
    nameComplete:    string;
    attachments:     any[];
    Talla:           null;
    Color:           null;
    Colores:         null;
    images:          ItemImage[];
    sellers:         ItemSeller[];
}

export interface ItemImage {
    imageId:           string;
    imageLabel:        string;
    imageLastModified: null;
    imageTag:          string;
    imageText:         string;
    imageUrl:          string;
}

export enum MeasurementUnit {
    Un = "un",
}

export interface ItemSeller {
    sellerId:        string;
    sellerName:      string;
    addToCartLink:   string;
    sellerDefault:   boolean;
    commertialOffer: PurpleCommertialOffer;
}

export interface PurpleCommertialOffer {
    AvailableQuantity:    number;
    Price:                number;
    PriceWithoutDiscount: number;
    ListPrice:            number;
    Tax:                  number;
    teasers?:             Teaser[];
}

export interface Teaser {
    name:       TeaserName;
    conditions: Conditions;
    effects:    Effects;
}

export interface Conditions {
    minimumQuantity: number;
    parameters:      Parameter[];
}

export interface Parameter {
    name:  ParameterName;
    value: string;
}

export enum ParameterName {
    PercentualDiscount = "PercentualDiscount",
    PromotionalPriceTableItemsDiscount = "PromotionalPriceTableItemsDiscount",
    PromotionalPriceTableItemsIDS = "PromotionalPriceTableItemsIds",
    RestrictionsBins = "RestrictionsBins",
}

export interface Effects {
    parameters: Parameter[];
}

export enum TeaserName {
    Exito174_Aliado102785308_MKP = "exito1_7.4_aliado_102785308_MKP",
    Exito1AliadoTabladepreciosElectrodigital = "exito1_aliado_tabladeprecios_electrodigital",
}

export interface Offers {
    lowPrice:   number;
    offerCount: number;
    offers:     Offer[];
}

export interface Offer {
    availability: string;
    price:        number;
    listPrice:    number;
    quantity:     number;
    itemOffered:  ItemOffered;
    seller:       OfferSeller;
}

export interface ItemOffered {
    measurementUnit: MeasurementUnit;
    sku:             string;
    unitMultiplier:  number;
    sellers:         ItemOfferedSeller[];
    properties:      ItemOfferedProperty[];
}

export interface ItemOfferedProperty {
    originalName: string;
    name:         string;
    values:       string[];
}

export interface ItemOfferedSeller {
    sellerId:        string;
    sellerDefault:   boolean;
    sellerName:      string;
    addToCartLink:   string;
    commertialOffer: FluffyCommertialOffer;
}

export interface FluffyCommertialOffer {
    AvailableQuantity: number;
}

export interface OfferSeller {
    identifier: string;
}

export interface ProductCluster {
    id:   string;
    name: string;
}

export interface ProductType {
    type:  Type;
    isMkp: boolean;
}

export enum Type {
    NoFood = "NO_FOOD",
}

export interface NodeProperty {
    name:   string;
    values: string[];
}

export interface PageInfo {
    totalCount: number;
}
