export class MedReminder{
  //relname: string;
  message: string;
  reportFrequency: string;
  medicines: Medicine[];
}

export class Medicine{

  name: string;
  frequency: string;
  day: string;
  date: string;
  timing: string;

}
