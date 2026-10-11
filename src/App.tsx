import { useRouter } from '@/hooks/useRouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/components/home/HomePage';
import BookingPage from '@/components/booking/BookingPage';
import MyAppointments from '@/components/my-appointments/MyAppointments';
import DashboardPage from '@/components/dashboard/DashboardPage';

function App() {
  const route = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar current={route} />
      <main className="flex-1">
        {route === 'home' && <HomePage />}
        {route === 'book' && <BookingPage />}
        {route === 'my-appointments' && <MyAppointments />}
        {route === 'dashboard' && <DashboardPage />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
