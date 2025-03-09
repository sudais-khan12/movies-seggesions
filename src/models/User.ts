import mongoose, { model, models } from "mongoose";

export interface ISearch {
  query: string;
  filters?: {
    genre?: string[];
    language?: string[];
    yearRange?: { start: number; end: number };
    imdbRating?: number;
  };
  timestamp: Date;
}

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  favorites: {
    movies: mongoose.Types.ObjectId[];
    series: mongoose.Types.ObjectId[];
    books: mongoose.Types.ObjectId[];
    songs: mongoose.Types.ObjectId[];
  };
  searchHistory: ISearch[];
  createdAt: Date;
  updatedAt: Date;
}

const SearchSchema = new mongoose.Schema<ISearch>({
  query: { type: String, required: true },
  filters: {
    genre: { type: [String], default: [] },
    language: { type: [String], default: [] },
    yearRange: {
      start: { type: Number, min: 1900 },
      end: { type: Number, max: new Date().getFullYear() },
    },
    imdbRating: { type: Number, min: 0, max: 10 },
  },
  timestamp: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    favorites: {
      movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
      series: [{ type: mongoose.Schema.Types.ObjectId, ref: "Series" }],
      books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
      songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    },
    searchHistory: [SearchSchema],
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
