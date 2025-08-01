import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaSearch, FaImage } from "react-icons/fa";
import {
  getItemDetails,
  claimItem,
  updateItem,
  assignKeeperToItem,
  generateOTPForItem,
  verifyOTPForItem,
} from "../services/itemService";
import { startConversation } from "../services/conversationService";
import { toast } from "react-toastify";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Something went wrong: {this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ItemDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false); // Separate loading for claim
  const [conversationLoading, setConversationLoading] = useState(false); // Separate loading for conversation
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    status: "",
    location: "",
    image: null,
  });
  const [removeImage, setRemoveImage] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpItemId, setOtpItemId] = useState(null);

  const fetchItem = async () => {
    console.log("Fetching item - id:", id, "user:", user);
    if (!id) {
      console.warn("No id provided for fetch");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      console.log("Sending request to getItemDetails with id:", id);
      const response = await getItemDetails(id);
      console.log("Received response from getItemDetails:", response.data);
      setItem(response.data.item || {});
      setEditFormData({
        title: response.data.item?.title || "",
        description: response.data.item?.description || "",
        category: response.data.item?.category?.name || "",
        status: response.data.item?.status || "",
        location: response.data.item?.location || "",
        image: null,
      });
    } catch (err) {
      console.error(
        "Fetch error:",
        err.message,
        "Response:",
        err.response?.data
      );
      toast.error(
        "Failed to load item: " + (err.response?.data?.message || err.message)
      );
      setItem({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Initial useEffect running - id:", id, "user:", user);
    fetchItem();
  }, [id]);

  useEffect(() => {
    console.log(
      "Secondary useEffect running - id:",
      id,
      "loading:",
      loading,
      "item:",
      item
    );
    if (!loading && !item) {
      fetchItem();
    }
  }, [loading, item]);

  const handleManualFetch = () => {
    console.log("Manual fetch triggered with id:", id);
    fetchItem();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files, type } = e.target;
    if (name === "image" && type === "file") {
      setEditFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (name === "removeImage") {
      setRemoveImage(e.target.checked);
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setClaimLoading(true); // Use claimLoading for edit action
    const data = new FormData();
    data.append("title", editFormData.title);
    data.append("description", editFormData.description);
    data.append("category", editFormData.category);
    data.append("status", editFormData.status);
    data.append("location", editFormData.location);
    if (editFormData.image) {
      data.append("image", editFormData.image);
    } else if (removeImage) {
      data.append("image", "");
    }

    try {
      await updateItem(id, data);
      setIsEditing(false);
      await fetchItem();
      toast.success("Item updated successfully");
    } catch (err) {
      toast.error(
        "Failed to update item: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setClaimLoading(true);
    try {
      await claimItem(id);
      await fetchItem();
      toast.success("Item claimed successfully! The owner will be notified.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        "Failed to claim item: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setConversationLoading(true);
    try {
      const participants = [user.id, item?.postedBy?._id];
      console.log(
        "Starting conversation with participants:",
        participants,
        "and itemId:",
        id
      );
      const response = await startConversation({ itemId: id, participants });
      console.log("Conversation API response:", response.data);
      if (
        response.data &&
        response.data.conversation &&
        response.data.conversation._id
      ) {
        navigate(`/messages/${response.data.conversation._id}`);
      } else if (response.status === 200 && response.data.conversation) {
        navigate(`/messages/${response.data.conversation._id}`);
      } else {
        throw new Error(
          "Invalid conversation response: _id not found in conversation object"
        );
      }
      toast.success("Conversation started successfully");
    } catch (err) {
      console.error(
        "Conversation error:",
        err.response ? err.response.data : err.message
      );
      toast.error(
        "Failed to start conversation: " +
          (err.response?.data?.message ||
            err.message ||
            "Unknown server error. Please try again later.")
      );
    } finally {
      setConversationLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const itemUrl = `${window.location.origin}${location.pathname}`;
      await navigator.clipboard.writeText(itemUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link to clipboard: " + err.message);
    }
  };

  const handleAssignKeeper = async () => {
    if (!user || user.role !== "keeper") return;
    setClaimLoading(true);
    try {
      const payload = { keeperId: user.id, keeperName: user.name };
      await assignKeeperToItem(id, payload);
      await fetchItem();
      toast.success("Assigned as keeper successfully");
    } catch (err) {
      toast.error(
        "Failed to assign keeper: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const handleGenerateOTP = async () => {
    if (!user) return;
    const isPoster = user.id === item?.postedBy?._id;
    const isKeeper = user.id === item?.keeperId;
    if (!isPoster && !isKeeper) {
      toast.error("Only the poster or assigned keeper can generate OTP.");
      return;
    }
    setClaimLoading(true);
    try {
      const response = await generateOTPForItem(id);
      setOtpItemId(id);
      setOtp("");
      toast.success(
        `OTP generated successfully: ${response.data.otp}. Share this with the claimant.`
      );
    } catch (err) {
      toast.error(
        "Failed to generate OTP: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }
    setClaimLoading(true);
    try {
      await verifyOTPForItem(id, { otp });
      await fetchItem();
      toast.success("OTP verified successfully! Item marked as returned.");
      setOtpItemId(null);
      setOtp("");
    } catch (err) {
      toast.error(
        "Failed to verify OTP: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const isOwner = user && String(user.id) === String(item?.postedBy?._id);
  const isKeeper = user && String(user.id) === String(item?.keeperId);
  const isClaimant = user && user.id === item?.claimedById;
  const isPosterOrKeeper =
    user &&
    (String(user.id) === String(item?.postedBy?._id) ||
      String(user.id) === String(item?.keeperId));

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!item || Object.keys(item).length === 0) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg font-medium">
          Item not found or failed to load.
        </p>
        <button
          onClick={handleManualFetch}
          className="ml-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
            {item.title}
          </h1>

          {!isEditing ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                {item.image ? (
                  <div
                    className="relative w-full h-64 rounded-lg overflow-hidden shadow-md cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium">
                        Click to enlarge
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center group hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ease-in-out">
                    <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-white bg-opacity-80 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all duration-300">
                      <div className="relative">
                        <FaSearch className="text-gray-400 text-4xl group-hover:text-blue-400 transition-colors duration-300" />
                        <FaImage className="text-gray-300 text-2xl absolute -bottom-1 -right-1 group-hover:text-blue-300 transition-colors duration-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-sm font-medium group-hover:text-gray-600 transition-colors duration-300">
                          No Image Available
                        </p>
                        <p className="text-gray-400 text-xs mt-1 group-hover:text-gray-500 transition-colors duration-300">
                          Upload an image to enhance visibility
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
                    Item Details
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">
                        Description:
                      </span>{" "}
                      {item.description}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Status:</span>{" "}
                      {item.status}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Category:</span>{" "}
                      {item.category?.name || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Location:</span>{" "}
                      {item.location}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Posted By:</span>{" "}
                      {item.postedBy?.name || "Unknown"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Posted On:</span>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Keeper:</span>{" "}
                      {item.keeperName || "Not Assigned"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Claimed By:</span>{" "}
                      {item.claimedByName || "Not Claimed"}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
                    Actions
                  </h2>
                  <div className="space-y-4">
                    {isOwner ? (
                      <div className="space-y-3">
                        <button
                          onClick={handleEdit}
                          className="w-full py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                        >
                          Edit Item
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {!isOwner && !isKeeper && (
                          <button
                            onClick={handleClaim}
                            disabled={claimLoading || item.status === "Claimed"}
                            className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                              claimLoading || item.status === "Claimed"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {claimLoading
                              ? "Processing..."
                              : item.status === "Claimed"
                              ? "Already Claimed"
                              : "Claim Item"}
                          </button>
                        )}
                        <button
                          onClick={handleStartConversation}
                          disabled={conversationLoading}
                          className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                            conversationLoading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {conversationLoading ? "Processing..." : "Message Owner"}
                        </button>
                      </div>
                    )}
                    {user && user.role === "keeper" && !item.keeperId && (
                      <div className="space-y-3">
                        <button
                          onClick={handleAssignKeeper}
                          disabled={claimLoading}
                          className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                            claimLoading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {claimLoading
                            ? "Processing..."
                            : "Assign Myself as Keeper"}
                        </button>
                      </div>
                    )}
                    {isPosterOrKeeper && item.status === "Claimed" && (
                      <div className="space-y-3">
                        <button
                          onClick={handleGenerateOTP}
                          disabled={claimLoading}
                          className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                            claimLoading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-orange-600 hover:bg-orange-700"
                          }`}
                        >
                          {claimLoading ? "Processing..." : "Generate OTP"}
                        </button>
                      </div>
                    )}
                    {otpItemId === id && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                        <button
                          onClick={handleVerifyOTP}
                          disabled={claimLoading}
                          className={`py-2 px-4 rounded-md text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                            claimLoading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {claimLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    )}
                    <button
                      onClick={handleShare}
                      className="w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                    >
                      Share Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleEditSubmit}
              className="bg-white rounded-lg shadow-lg p-6"
              encType="multipart/form-data"
            >
              <div className="mb-6">
                {item.image ? (
                  <div
                    className="relative w-full h-64 rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium">
                        Current Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center mb-2 group hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ease-in-out">
                    <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-white bg-opacity-80 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all duration-300">
                      <div className="relative">
                        <FaSearch className="text-gray-400 text-4xl group-hover:text-blue-400 transition-colors duration-300" />
                        <FaImage className="text-gray-300 text-2xl absolute -bottom-1 -right-1 group-hover:text-blue-300 transition-colors duration-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-sm font-medium group-hover:text-gray-600 transition-colors duration-300">
                          No Image Available
                        </p>
                        <p className="text-gray-400 text-xs mt-1 group-hover:text-gray-500 transition-colors duration-300">
                          Select a new image below
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="removeImage"
                      checked={removeImage}
                      onChange={handleEditChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Remove Image</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-y"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    >
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                      <option value="Claimed">Claimed</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={claimLoading}
                  className={`py-2 px-4 rounded-md text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                    claimLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {claimLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {isImageModalOpen && item.image && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div className="relative max-w-4xl w-full h-[80vh] bg-white rounded-lg overflow-hidden shadow-2xl">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
              >
                ×
              </button>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default ItemDetails;