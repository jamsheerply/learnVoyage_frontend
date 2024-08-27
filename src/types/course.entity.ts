// export interface ILessonContent {
//   lessonNumber: string;
//   lessonTitle: string;
//   description: string;
//   videoUrl: string;
// }

// export interface ICourse {
//   id: string;
//   courseName: string;
//   category: string;
//   description: string;
//   language: string;
//   coursePrice: number;
//   courseThumbnailUrl: string;
//   courseDemoVideoUrl: string;
//   mentorId: string;
//   content: ILessonContent[];
// }

export interface ILessonContent {
  lessonNumber: string;
  lessonTitle: string;
  description: string;
  video: {
    publicId: string;
    version: string;
  };
}

export interface ICourse {
  id: string;
  courseName: string;
  categoryId?: string;
  description: string;
  language: string;
  coursePrice: number;
  courseThumbnailUrl: string;
  courseDemoVideo: {
    publicId: string;
    version: string;
  };
  mentorId: string;
  isBlocked?: boolean;
  reason?: string;
  lessons: ILessonContent[];
}
