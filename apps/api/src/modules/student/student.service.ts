import { BaseService } from '@api-base/base-classes/BaseService';
import { IStudent, StudentModel } from './student.model';
import { UserModel, UserRole } from '../user/user.model';
import { Ref } from '@typegoose/typegoose';
import { IUser } from '../user/user.model';

export class StudentService extends BaseService<IStudent> {
  constructor() {
    super(StudentModel);
  }

  async create(studentData: IStudent): Promise<IStudent> {
    const { name, email } = studentData;

    // Step 1: Check if a student with the same email already exists
    const existingStudent = await StudentModel.findOne({ email });
    if (existingStudent) {
      throw new Error('Student with this email already exists');
    }

    // Step 2: Check if a user already exists for this email
    let existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      existingUser = await UserModel.create({
        name,
        email,
        password: 'student@123',
        role: UserRole.STUDENT,
        isActive: true,
      });
    }

    // Step 3: Set the reference to the created/found user
    studentData.userProfileId = existingUser._id as Ref<IUser>;

    // Step 4: Generate a unique studentId (e.g. STD2025-0001)
    // const year = new Date().getFullYear();
    // const lastStudent = await StudentModel
    //   .findOne({ studentId: new RegExp(`^STD${year}`) })
    //   .sort({ createdAt: -1 });

    // let nextNumber = 1;
    // if (lastStudent) {
    //   const match = lastStudent.studentId.match(/(\d+)$/);
    //   if (match) {
    //     nextNumber = parseInt(match[1]) + 1;
    //   }
    // }
    // const padded = String(nextNumber).padStart(4, '0');
    // studentData.studentId = `STD${year}-${padded}`;

    // Step 5: Create the student
    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
}
