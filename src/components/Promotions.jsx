import React from 'react';

export function Promotions() {
  const promotions = [
    {
      title: "FLASH SALE",
      description: "48 hours only! Up to 70% off luxury resorts",
      bgColor: "bg-gradient-to-br from-red-600 to-orange-600"
    },
    {
      title: "INSIDER ACCESS",
      description: "Exclusive tours not available to the public",
      bgColor: "bg-gradient-to-br from-violet-600 to-purple-700"
    },
    {
      title: "LAST MINUTE",
      description: "Spontaneous getaways at half price. Book now, fly tomorrow",
      bgColor: "bg-gradient-to-br from-blue-600 to-cyan-600"
    },
    {
      title: "VIP UPGRADE",
      description: "Free suite upgrades when you book direct",
      bgColor: "bg-gradient-to-br from-emerald-600 to-teal-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 cursor-pointer">
        {promotions.map((promo, index) => (
          <div 
            key={index} 
            className={`${promo.bgColor} p-6 rounded-lg overflow-hidden relative transform transition-all duration-500 hover:scale-105 shadow-xl`}
          >
            {/* Animated background element */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white opacity-10 blur-xl"></div>
            
            <h3 className="font-black text-2xl tracking-tight mb-2">{promo.title}</h3>
            <p className="text-white text-opacity-90 mb-6 text-sm">{promo.description}</p>
            
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs uppercase tracking-wider">Claim Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Top corner triangle decoration */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-white opacity-10 rotate-45 transform"></div>
          </div>
        ))}
      </div>
    </div>
  );
}