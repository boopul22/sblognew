import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-4">
            About Us
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-6">
            Hamare Baare Mein
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Hinglish Section */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-6">
              Dil Ke Jazbaat - Ek Introduction
            </h3>
            <div className="space-y-4 text-primary-text dark:text-dark-primary-text leading-relaxed">
              <p>
                "Dil Ke Jazbaat" ek aisa platform hai jahan shayari aur poetry ke lovers apne dil ki baat keh sakte hain.
                Yahan har word mein ek story hai, har sher mein ek feeling hai.
              </p>
              <p>
                Hamara mission hai Hindi aur Hinglish shayari ko ek beautiful aur modern way mein present karna.
                Ye website un sabke liye hai jo words ki power mein believe karte hain.
              </p>
              <p>
                Chahe aap love ki shayari padhna chahte ho, dard bhare alfaaz sunna chahte ho, ya phir
                zindagi ke philosophy ko samajhna chahte ho - yahan har mood ke liye kuch na kuch hai.
              </p>
            </div>
          </div>

          {/* English Section */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-6">
              Dil Ke Jazbaat - An Introduction
            </h3>
            <div className="space-y-4 text-primary-text dark:text-dark-primary-text leading-relaxed">
              <p>
                "Dil Ke Jazbaat" is a platform where lovers of shayari and poetry can express their heart's feelings. 
                Here, every word tells a story, every couplet carries an emotion.
              </p>
              <p>
                Our mission is to present Hindi and Hinglish shayari in a beautiful and modern format. 
                This website is for all those who believe in the power of words.
              </p>
              <p>
                Whether you want to read love poetry, listen to painful words, or understand life's philosophy - 
                there's something here for every mood.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-6">
              Features / Khasiyat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-dark-primary-text">
                      Bilingual Content / Do Bhasha
                    </h4>
                    <p className="text-secondary-text dark:text-dark-secondary-text text-sm">
                      Hindi aur Hinglish dono mein shayari
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-dark-primary-text">
                      Dark/Light Mode / Theme
                    </h4>
                    <p className="text-secondary-text dark:text-dark-secondary-text text-sm">
                      Apki pasand ke according theme
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-dark-primary-text">
                      Categories / Sections
                    </h4>
                    <p className="text-secondary-text dark:text-dark-secondary-text text-sm">
                      Different topics par based shayari
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-dark-primary-text">
                      Search Feature / Dhundne ki Facility
                    </h4>
                    <p className="text-secondary-text dark:text-dark-secondary-text text-sm">
                      Easily apni favorite shayari dhundo
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-dark-primary-text">
                      Sharing / Share Karna
                    </h4>
                    <p className="text-secondary-text dark:text-dark-secondary-text text-sm">
                      Shayari ko easily copy aur share karo
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-dark-primary-text">
                      Comments / Feedback
                    </h4>
                    <p className="text-secondary-text dark:text-dark-secondary-text text-sm">
                      Apne thoughts share karo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-card-border dark:border-dark-card-border shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold font-serif text-primary-text dark:text-dark-primary-text mb-6">
              Contact / Sampark
            </h3>
            <div className="space-y-4 text-primary-text dark:text-dark-primary-text">
              <p>
                Agar aapke paas koi suggestion, feedback ya question hai, toh please humse contact karo.
                Hum aapki baat sunne ke liye hamesha ready hain.
              </p>
              <p>
                If you have any suggestions, feedback, or questions, please feel free to contact us.
                We're always ready to listen to you.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block bg-primary dark:bg-dark-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 dark:hover:bg-dark-primary/90 transition-colors"
            >
              Start Reading Shayari / Shayari Padhna Shuru Karo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
