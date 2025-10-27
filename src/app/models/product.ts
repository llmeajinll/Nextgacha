import mongoose, { Schema, model, models } from 'mongoose';

const productSchema = new Schema(
  {
    image: [{ type: String, required: false }],
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    list: [
      {
        name: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
    totalCount: { type: Number, default: 0 },
    // create: { type: Date | String },
  },
  { timestamps: true }
);

// ✅ 저장 전 totalCount 자동 계산
productSchema.pre('save', function (next) {
  this.totalCount = this.list
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);
  next();
});

// ✅ 업데이트 시에도 totalCount 갱신
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any;
  if (update.list) {
    update.totalCount = update.list.length;
  }
  next();
});

export const Product = models.Product || model('Product', productSchema);
