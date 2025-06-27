import React from 'react';
const testimonials = [
  {
    name: 'Jane Doe',
    title: 'Mental Health Advocate',
    initials: 'JD',
    feedback: 'EmotiCore helped me sort through my thoughts in a non-judgmental space, providing timely support whenever I needed it most.',
  },
  {
    name: 'John Smith',
    title: 'Community Manager',
    initials: 'JS',
    feedback: 'The AI therapist experience is so warm and welcoming, it feels like having someone who really listens to you any time of the day.',
  },
  {
    name: 'Alice Brown',
    title: 'Therapist in Training',
    initials: 'AB',
    feedback: "As someone studying therapy, I'm impressed by how EmotiCore models empathetic responses and encourages reflection.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-blue-700 sm:text-4xl">What Our Users Are Saying</h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-600">{testimonial.initials}</span>
              </div>
              <blockquote className="text-center">
                <p className="text-lg font-medium text-gray-700">"{testimonial.feedback}"</p>
                <footer className="mt-4">
                  <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
