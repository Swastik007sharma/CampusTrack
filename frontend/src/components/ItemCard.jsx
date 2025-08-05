import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ItemCard = ({
  item,
  onEdit,
  onDelete,
  showActions = true,
  isEditing = false,
  editFormData,
  onEditChange,
  onEditSubmit,
  onCancelEdit,
  onMarkAsReturned,
  onGenerateOTP,
  onVerifyOTP,
  otp,
  setOtp,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full relative">
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-100 rounded-t-xl overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(item.image, '_blank')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
            No Image Available
          </div>
        )}
        {showActions && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
              aria-label="Edit item"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
              aria-label="Delete item"
            >
              <FaTrash size={16} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="p-4 sm:p-5">
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={onEditChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={onEditChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base h-20"
              required
            />
            <select
              name="status"
              value={editFormData.status}
              onChange={onEditChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
              required
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
              <option value="Claimed">Claimed</option>
              <option value="Returned">Returned</option>
            </select>
            <input
              type="text"
              name="category"
              value={editFormData.category}
              onChange={onEditChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
            <input
              type="text"
              name="location"
              value={editFormData.location}
              onChange={onEditChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
            <input
              type="file"
              name="image"
              onChange={onEditChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onEditSubmit}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          <div className="text-sm sm:text-base text-gray-600 space-y-2 mb-4">
            <p>
              <span className="font-medium text-gray-800">Status:</span>{' '}
              <span className="capitalize">{item.status}</span>
            </p>
            <p>
              <span className="font-medium text-gray-800">Category:</span>{' '}
              {item.category?.name || 'N/A'}
            </p>
            <p>
              <span className="font-medium text-gray-800">Posted On:</span>{' '}
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to={`/items/${item._id}`}
              className="text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 transition-colors text-right"
            >
              View Details
            </Link>

            {/* ✅ New conditional buttons based on status */}
            {showActions && (
              <>
                {item.status === 'Lost' && (
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors text-sm w-full"
                  >
                    Found It?
                  </button>
                )}
                {item.status === 'Found' && (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm w-full"
                  >
                    Claim as Mine
                  </button>
                )}
              </>
            )}

            {item.status === 'Claimed' && showActions && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={onGenerateOTP}
                  className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition-colors text-sm w-full"
                >
                  Generate OTP
                </button>
                {onVerifyOTP && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      onClick={onVerifyOTP}
                      className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 transition-colors text-sm"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
