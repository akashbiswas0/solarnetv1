import { buyOrder } from "../utils";

interface CardProps {
  array: any[];
}

const Card: React.FC<CardProps> = ({ array }) => {
  // Trim the seller address for display
  const seller = array[0];
  const sellerDisplay = seller && seller.length > 10 ? `${seller.slice(0, 6)}...${seller.slice(-4)}` : seller;
  return (
    <div className="w-full max-w-7xl flex flex-row items-center justify-between bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_#000] p-4 my-4 mx-auto">
      {/* Seller */}
      <div className="flex-1 text-left font-pixel text-lg text-emerald-700">
        <div className="font-bold mb-1">Seller</div>
        <div className="bg-gray-100 border-2 border-black rounded-lg px-3 py-1 font-bold text-black inline-block">
          {sellerDisplay}
        </div>
      </div>
      {/* SNT Tokens */}
      <div className="flex-1 text-center font-pixel text-lg text-emerald-700">
        <div className="font-bold mb-1">SNT Tokens</div>
        <div className="bg-gray-100 border-2 border-black rounded-lg px-3 py-1 font-bold text-black inline-block">
          {Number(array[10])}
        </div>
      </div>
      {/* Price */}
      <div className="flex-1 text-center font-pixel text-lg text-yellow-500">
        <div className="font-bold mb-1">Price</div>
        <div className="bg-yellow-200 border-2 border-black rounded-lg px-3 py-1 font-bold text-black inline-block">
          {Number(array[3] / BigInt("1000000000000000")) / 1000}
        </div>
      </div>
      {/* Chain */}
      <div className="flex-1 text-center font-pixel text-lg text-blue-600">
        <div className="font-bold mb-1">Chain</div>
        <div className="bg-blue-100 border-2 border-black rounded-lg px-3 py-1 font-bold text-black inline-block">
          base Sepolia
        </div>
      </div>
      {/* Buy Button */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => buyOrder(Number(array[2]), BigInt(array[3].toString()))}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 text-lg"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default Card;