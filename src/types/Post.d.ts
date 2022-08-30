import { UserData } from './User';

export type Post = {
  id: string;
  parent: Post;
  title: string;
  content: string;
  ratio: number;
  replies: number;
  created: string;
  updated: string;
  author: {
    id: string;
    member: {
      nickname: string;
    };
  };
  childrens: {
    objects: Post[];
  };
  viewers: {
    edges: {
      node: UserData;
    }[];
  };
};
