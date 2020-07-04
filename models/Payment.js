const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let PaymentSchema = mongoose.Schema(
  {
    cardname: {
      type: String,
      required: true,
    },
    cardnumber: {
      type: String,
      required: true,
    },
    expiry: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
        },
        orderId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Order'
    },
    transferNo: {
      type: Number,
      default: () => {
        return (
          Math.floor(Math.random() * 900000000300000000000) + 1000000000000000
        );
      },
      createIndexes: { unique: true },
    },
  },
  { timestamps: true }
);
module.exports = Product = mongoose.model("Payment", PaymentSchema);
