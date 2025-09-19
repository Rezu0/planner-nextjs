import mongoose, { Schema, Types } from "mongoose";

export interface IPlanner extends Document {
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
  idUser: Types.ObjectId;
}

const PlannerSchema: Schema<IPlanner> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    allDay: { type: Boolean, default: true },
    idUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

delete mongoose.models.Planner;
export default mongoose.models.Planner || mongoose.model<IPlanner>("Planner", PlannerSchema);
