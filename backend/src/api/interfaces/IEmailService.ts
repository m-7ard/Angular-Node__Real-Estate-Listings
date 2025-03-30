import RealEstateListing from "domain/entities/RealEstateListing";

interface IEmailService {
    sendRealEstateListingInquiryEmail(params: { inquiry: string; listing: RealEstateListing; email: string }): void;
}

export default IEmailService;