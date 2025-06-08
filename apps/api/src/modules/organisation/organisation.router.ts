import { Router } from "express";
import { OrganisationController } from "./organisation.controller";

const router = Router();
const organisationController = new OrganisationController();

router.post("/", organisationController.handleCreate);
router.post("/list", organisationController.handleGetAll);
router.post("/details", organisationController.handleGetById);
router.put("/:_id", organisationController.handleUpdate);
router.delete("/:_id", organisationController.handleDelete);

export default router;