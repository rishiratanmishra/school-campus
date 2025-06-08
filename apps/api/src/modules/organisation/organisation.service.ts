import { BaseService } from "@api-base/base-classes/BaseService";
import { IOrganisation, OrganisationModel } from "./organisation.model";

export class OrganisationService extends BaseService<IOrganisation> {
    constructor() {
        super(OrganisationModel);
    }
}