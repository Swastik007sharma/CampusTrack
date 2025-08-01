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
  onMarkAsReturned, // New prop for marking item as returned
  onGenerateOTP,    // New prop for generating OTP
  onVerifyOTP,      // New prop for verifying OTP
  otp,              // OTP value
  setOtp,           // Function to update OTP
}) => {
  return (
    <div className="rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full relative"
      style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-secondary)', color: 'var(--color-text)' }}>
      <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-t-xl overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(item.image, '_blank')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>
            No Image Available
          </div>
        )}
        {showActions && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-full"
              style={{ background: 'var(--color-bg)', color: 'var(--color-primary)' }}
              aria-label="Edit item"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-full"
              style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
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
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              style={{ 
                border: '1px solid var(--color-secondary)', 
                background: 'var(--color-bg)', 
                color: 'var(--color-text)' 
              }}
              required
            />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={onEditChange}
              className="w-full p-2 border rounded-md text-sm sm:text-base h-20"
              style={{ 
                border: '1px solid var(--color-secondary)', 
                background: 'var(--color-bg)', 
                color: 'var(--color-text)' 
              }}
              required
            />
            <select
              name="status"
              value={editFormData.status}
              onChange={onEditChange}
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              style={{ 
                border: '1px solid var(--color-secondary)', 
                background: 'var(--color-bg)', 
                color: 'var(--color-text)' 
              }}
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
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              style={{ 
                border: '1px solid var(--color-secondary)', 
                background: 'var(--color-bg)', 
                color: 'var(--color-text)' 
              }}
              required
            />
            <input
              type="text"
              name="location"
              value={editFormData.location}
              onChange={onEditChange}
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              style={{ 
                border: '1px solid var(--color-secondary)', 
                background: 'var(--color-bg)', 
                color: 'var(--color-text)' 
              }}
              required
            />
            <input
              type="file"
              name="image"
              onChange={onEditChange}
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              style={{ 
                border: '1px solid var(--color-secondary)', 
                background: 'var(--color-bg)', 
                color: 'var(--color-text)' 
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onEditSubmit}
                className="px-3 py-1 rounded-md transition-colors text-sm"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="px-3 py-1 rounded-md transition-colors text-sm"
                style={{ background: 'var(--color-secondary)', color: 'var(--color-text)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-text)' }}>
            {item.title}
          </h3>
          <div className="text-sm sm:text-base space-y-2 mb-4" style={{ color: 'var(--color-text)' }}>
            <p>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>Status:</span>{' '}
              <span className="capitalize">{item.status}</span>
            </p>
            <p>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>Category:</span>{' '}
              {item.category?.name || 'N/A'}
            </p>
            <p>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>Posted On:</span>{' '}
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to={`/items/${item._id}`}
              className="text-sm sm:text-base font-medium underline underline-offset-2 transition-colors text-right"
              style={{ color: 'var(--color-primary)' }}
            >
              View Details
            </Link>
            {item.status === 'Claimed' && showActions && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={onGenerateOTP}
                  className="px-3 py-1 rounded-md transition-colors text-sm w-full"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
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
                      className="w-full p-2 border rounded-md text-sm"
                      style={{ 
                        border: '1px solid var(--color-secondary)', 
                        background: 'var(--color-bg)', 
                        color: 'var(--color-text)' 
                      }}
                    />
                    <button
                      onClick={onVerifyOTP}
                      className="px-3 py-1 rounded-md transition-colors text-sm"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
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