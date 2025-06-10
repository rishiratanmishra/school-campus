import { BaseController } from "@api-base/base-classes/BaseController";
import { IStudent } from "./student.model";
import { StudentService } from "./student.service";



export class StudentController extends BaseController<IStudent> {
  constructor() {
    super(new StudentService());
    }
    // handleCreate = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const studentData: IStudent = req.body;
    //         const newStudent = await this.service.create(studentData);
    //         res.status(201).json(newStudent);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // };
}