import AddressAutocomplete from "./AddressAutocomplete";
import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

function PlaceOrder() {

  const [method, setMethod] = useState("cod");
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    navigate,
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fullAddress: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // ✅ Set loaded after first mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // ✅ Only redirect if cart is empty AFTER initial load
  useEffect(() => {
    if (isLoaded && Object.keys(cartItems).length === 0) {
      toast.info("Cart is empty");
      navigate("/");
    }
  }, [cartItems, navigate, isLoaded]);

  // ✅ Razorpay handler
  const initPay = (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay failed to load. Please refresh.");
      return;
    }

    console.log("Razorpay order:", order); // 👈 check what's coming

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Test Transaction",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.receipt,
            },
            { headers: { token } }
          );
          if (data.success) {
            toast.success("Payment successful!");
            setCartItems({});
            navigate("/orders");
          }
        } catch (error) {
          toast.error("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
};

  // ✅ Submit handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.fullAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    try {
      let orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          const quantity = cartItems[itemId][size];

          if (quantity > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            );

            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = quantity;
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("No items in cart");
        return;
      }

      const amount = getCartAmount() + delivery_fee;

      if (isNaN(amount) || amount <= 0) {
        toast.error("Invalid cart amount");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: amount,
      };

      console.log("Order Items:", orderItems);
      console.log("Amount:", amount);

      switch (method) {

        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            toast.success("Order placed successfully!");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          console.log("Stripe response:", responseStripe.data);
          if (responseStripe.data.success) {
            window.location.replace(responseStripe.data.session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case "razorpay":
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          console.log("Razorpay response:", responseRazorpay.data);
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;

        default:
          toast.error("Please select a payment method");
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const taxRate = 0;

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >

      {/* LEFT SIDE - Order Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">

        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"ORDER"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={formData.firstName}
            placeholder="First name *"
            className="border px-3 py-2 w-full rounded"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={formData.lastName}
            placeholder="Last name *"
            className="border px-3 py-2 w-full rounded"
          />
        </div>

        <input
          required
          name="email"
          type="email"
          onChange={onChangeHandler}
          value={formData.email}
          placeholder="Email address *"
          className="border px-3 py-2 rounded"
        />

        <AddressAutocomplete
          onSelect={(item) => {
            setFormData((prev) => ({
              ...prev,
              fullAddress: item.display_name,
            }));
          }}
        />

        {/* Show selected address */}
        {formData.fullAddress && (
          <p className="text-sm text-gray-500 border px-3 py-2 rounded bg-gray-50">
            📍 {formData.fullAddress}
          </p>
        )}

        <input
          required
          name="phone"
          type="tel"
          onChange={onChangeHandler}
          value={formData.phone}
          placeholder="Phone number *"
          className="border px-3 py-2 rounded"
        />

      </div>

      {/* RIGHT SIDE - Cart Total & Payment */}
      <div className="w-full sm:max-w-[400px]">

        <CartTotal taxRate={taxRate} />

        <div className="mt-10">

          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex gap-3 flex-col mt-4">

            {/* Stripe */}
            <div
              onClick={() => setMethod("stripe")}
              className={`border p-3 cursor-pointer flex items-center gap-3 rounded transition-all
                ${method === "stripe" ? "bg-green-100 border-green-500" : "hover:bg-gray-50"}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${method === "stripe" ? "border-green-500" : "border-gray-400"}`}>
                {method === "stripe" && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
              </div>
              <span className="font-medium">Stripe</span>
            </div>

            {/* Razorpay */}
            <div
              onClick={() => setMethod("razorpay")}
              className={`border p-3 cursor-pointer flex items-center gap-3 rounded transition-all
                ${method === "razorpay" ? "bg-green-100 border-green-500" : "hover:bg-gray-50"}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${method === "razorpay" ? "border-green-500" : "border-gray-400"}`}>
                {method === "razorpay" && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
              </div>
              <span className="font-medium">Razorpay</span>
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod("cod")}
              className={`border p-3 cursor-pointer flex items-center gap-3 rounded transition-all
                ${method === "cod" ? "bg-green-100 border-green-500" : "hover:bg-gray-50"}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${method === "cod" ? "border-green-500" : "border-gray-400"}`}>
                {method === "cod" && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
              </div>
              <span className="font-medium">Cash on Delivery</span>
            </div>

          </div>

          <button
            type="submit"
            className="mt-6 bg-black text-white px-10 py-3 w-full rounded hover:bg-gray-800 transition-colors font-medium tracking-wide"
          >
            PLACE ORDER
          </button>

        </div>

      </div>

    </form>
  );
}

export default PlaceOrder;