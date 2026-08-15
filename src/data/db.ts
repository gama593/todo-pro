import Dexie, { type Table } from "dexie";

export type Priority = 1|2|3|4;
export type Status = "todo"|"in-progress"|"done";
export interface Recurrence { frequency:"daily"|"weekly"|"monthly"|"yearly"; interval:number; weekdays?:number[]; endDate?:string; }
export interface Task { id:string; title:string; description:string; completed:boolean; completedAt?:string; priority:Priority; status:Status; projectId?:string; parentTaskId?:string; tags:string[]; dueDate?:string; dueTime?:string; duration?:number; recurrence?:Recurrence; reminder?:string; createdAt:string; updatedAt:string; order:number; }
export interface Project { id:string; name:string; description:string; color:string; archived:boolean; createdAt:string; updatedAt:string; }
export interface Tag { id:string; name:string; color:string; createdAt:string; }

export class TodoDatabase extends Dexie {
 tasks!:Table<Task,string>; projects!:Table<Project,string>; tags!:Table<Tag,string>;
 constructor(){ super("TodoProScratch"); this.version(1).stores({tasks:"id,completed,status,dueDate,projectId,parentTaskId,createdAt,updatedAt,*tags",projects:"id,name,archived",tags:"id,name"}); }
}
export const db = new TodoDatabase();
export const now = () => new Date().toISOString();
export const today = () => new Date().toISOString().slice(0,10);
export function newTask(title:string, dueDate?:string):Task { const t=now(); return {id:crypto.randomUUID(),title,description:"",completed:false,priority:4,status:"todo",tags:[],dueDate,createdAt:t,updatedAt:t,order:Date.now()}; }
