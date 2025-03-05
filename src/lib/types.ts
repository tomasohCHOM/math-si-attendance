export type Student = {
  name: string;
  cwid: string;
  checkedForAttendance: boolean;
};

type Attending = "processed" | "processing" | "none" | "failed";

export type StudentAttending = {
  student: Student;
  attending: Attending;
};
