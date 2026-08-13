import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  th: {
    translation: {
      // ── Menu ──
      menu: {
        title: 'เมนู',
        home: 'หน้าแรก',
        busStops: 'จุดจอดรถโดยสาร',
        routeInfo: 'ข้อมูลเส้นทาง',
        help: 'ช่วยเหลือและสนับสนุน',
      },

      // ── Topbar ──
      topbar: {
        searchPlaceholder: 'ค้นหา... (กด Enter เพื่อค้นหา)',
        searchTitle: 'ค้นหา',
        vehicleTypes: {
          tour: 'รถทัวร์',
          van: 'รถตู้',
          songtaew: 'รถสองแถว',
        },
        lang: {
          th: 'ไทย',
          en: 'อังกฤษ',
        },
      },

      // ── Index / Hero ──
      hero: {
        headline: 'การเดินทางครั้งต่อไปของคุณจะไปที่ไหน',
        rotating: ['เริ่มต้น', 'พาคุณไป', 'เริ่มเส้นทาง', 'นำคุณ'],
        subtitle: 'ค้นหาเส้นทางรถโดยสารที่ดีที่สุดทั่วนครราชสีมาในไม่กี่วินาที',
        from: 'ต้นทาง',
        to: 'ปลายทาง',
        search: 'ค้นหา',
      },

      // ── Guidebook ──
      guidebook: {
        title: 'คู่มือการใช้งาน',
        subtitle: 'ค้นพบวิธีที่ดีที่สุดในการเดินทางทั่วนครราชสีมา แพลตฟอร์มของเราช่วยให้คุณนำทางผ่านเส้นทางรถโดยสารที่ซับซ้อนได้อย่างง่ายดายและมั่นใจ',
        steps: [
          {
            title: 'ขั้นตอนที่ 1: เลือกเส้นทาง',
            desc: 'เลือกจุดเริ่มต้นและปลายทางจากสถานที่ที่มีในระบบ',
          },
          {
            title: 'ขั้นตอนที่ 2: เปรียบเทียบตัวเลือก',
            desc: 'ตรวจสอบบริษัทรถโดยสาร เวลาเดินรถ และประเภทรถ',
          },
          {
            title: 'ขั้นตอนที่ 3: ดูรายละเอียด',
            desc: 'ตรวจสอบเส้นทางบนแผนที่และดูจุดจอดทั้งหมดระหว่างทาง',
          },
          {
            title: 'ขั้นตอนที่ 4: เริ่มการเดินทาง',
            desc: 'ไปยังสถานีด้วยความมั่นใจโดยใช้ข้อมูลที่แม่นยำของเรา',
          },
        ],
      },

      // ── Route Information ──
      ri: {
        pageTitle: 'ข้อมูลเส้นทาง',
        selectRoute: 'เลือกเส้นทาง...',
        from: 'ต้นทาง',
        to: 'ปลายทาง',
        quickSelect: 'เลือกเส้นทางด่วน',
        searchBtn: 'ค้นหา',
        noResult: 'ไม่พบเส้นทางที่ตรงกัน',
        via: 'ผ่าน',
        line: 'สาย',
        startAt: 'เริ่มต้นที่',
        endAt: 'สิ้นสุดที่',
        mapSimulation: 'จำลองเส้นทางบนแผนที่',
        closeMap: 'ปิดแผนที่จำลอง',
        viewSchedule: 'ดูตารางเวลา',
        vehicleAc: 'AC (ปรับอากาศ)',
        vehicleFan: 'Fan (พัดลม)',
        vehicleMinibus: 'Minibus (รถสองแถว)',
        vehicleVan: 'Van (รถตู้)',
        vehicleBus: 'Bus (รถทัวร์)',
      },

      // ── Bus Stops ──
      busStops: {
        title: 'ป้ายรถโดยสาร',
        searchPlaceholder: 'ค้นหาป้ายรถโดยสาร...',
        noResult: 'ไม่พบป้ายที่ตรงกัน',
        filters: {
          allOrigins: 'จุดเริ่มต้นทั้งหมด',
          all: 'ทั้งหมด',
          bus: 'รถทัวร์',
          minibus: 'รถสองแถว',
          van: 'รถตู้',
        },
        card: {
          stop: 'จุดจอด:',
          line: 'สาย',
        }
      },

      // ── Help ──
      help: {
        title: 'ศูนย์ช่วยเหลือและติดต่อสอบถาม',
        subtitle: 'BKS Official Contact & Support Hub',
        bksPortal: 'ติดต่อ บริษัท ขนส่ง จำกัด (บขส.)',
        bksPortalDesc: 'ส่งเรื่องร้องเรียน สอบถามข้อมูล หรือแจ้งข้อเสนอแนะผ่านเว็บไซต์หลัก',
        goToWebsite: 'ไปยังเว็บหลัก บขส.',
        hotline: 'สายด่วน & เบอร์ติดต่อหลัก',
        callCenter: 'Call Center บขส. (24 ชั่วโมง)',
        callCenterDesc: 'สอบถามตารางรถและเที่ยวรถทั่วประเทศ',
        callBtn: 'โทร',
        hq: 'สำนักงานใหญ่ บขส. (หมอชิต 2)',
        hqDesc: 'โทร 0-2936-2852 ถึง 66',
        callOut: 'โทรออก',
        terminalsTitle: 'เบอร์โทรศัพท์สถานีขนส่งผู้โดยสาร',
        terminals: [
          { name: 'สถานีขนส่งผู้โดยสาร นครราชสีมา แห่งที่ 1 (บขส.เก่า)' },
          { name: 'สถานีขนส่งผู้โดยสาร นครราชสีมา แห่งที่ 2 (บขส.ใหม่)' },
          { name: 'สถานีขนส่งผู้โดยสาร กรุงเทพฯ (หมอชิต 2)' },
        ],
        faqTitle: 'คำถามที่พบบ่อย (FAQ)',
        faqs: [
          {
            question: 'ขั้นตอนการจองตั๋วรถโดยสาร บขส. ออนไลน์',
            answer: 'สามารถค้นหาเที่ยวรถและเลือกจุดหมายปลายทางได้ผ่านหน้าหลักของเว็บไซต์ หรือจองผ่านแอปพลิเคชัน BKS E-Ticket และเว็บไซต์หลักของ บขส.',
          },
          {
            question: 'การยกเลิก คืนตั๋ว หรือเลื่อนวันเดินทาง',
            answer: 'ต้องนำตั๋วโดยสารและบัตรประชาชนไปติดต่อที่ช่องจำหน่ายตั๋ว บขส. ณ สถานีขนส่งผู้โดยสาร ล่วงหน้าอย่างน้อย 3 ชั่วโมงก่อนเวลารถออก',
          },
          {
            question: 'ข้อกำหนดสัมภาระติดตัว',
            answer: 'ผู้โดยสารสามารถนำสัมภาระติดตัวได้ท่านละไม่เกิน 2 ชิ้น น้ำหนักรวมไม่เกิน 20 กิโลกรัม โดยไม่เสียค่าบริการเพิ่ม',
          },
          {
            question: 'การติดตามสัมภาระสูญหาย',
            answer: 'แจ้งศูนย์บริการลูกค้า Call Center 1490 ทันที โดยระบุหมายเลขสายรถและรอบเวลาเดินทาง',
          },
        ]
      },
      
      // ── Map ──
      map: {
        origin: 'ต้นทาง: ',
        dest: 'ปลายทาง: ',
      }
    },
  },

  en: {
    translation: {
      // ── Menu ──
      menu: {
        title: 'Menu',
        home: 'Home',
        busStops: 'Bus Stops',
        routeInfo: 'Route Information',
        help: 'Help & Support',
      },

      // ── Topbar ──
      topbar: {
        searchPlaceholder: 'Where to? (Press Enter to search)',
        searchTitle: 'Search',
        vehicleTypes: {
          tour: 'Tour Bus',
          van: 'Van',
          songtaew: 'Songtaew',
        },
        lang: {
          th: 'Thai',
          en: 'English',
        },
      },

      // ── Index / Hero ──
      hero: {
        headline: 'Where will your next journey begin?',
        rotating: ['begin', 'take you', 'start', 'lead you'],
        subtitle: 'Find the best bus routes across Nakhon Ratchasima in seconds.',
        from: 'Origin',
        to: 'Destination',
        search: 'Search',
      },

      // ── Guidebook ──
      guidebook: {
        title: 'GuideBook',
        subtitle: 'Discover the best way to travel around Nakhon Ratchasima. Our platform helps you navigate the complex bus routes with ease and confidence.',
        steps: [
          {
            title: 'Step 1: Choose Route',
            desc: 'Select your starting point and destination from the available locations.',
          },
          {
            title: 'Step 2: Compare Options',
            desc: 'Review different bus companies, times, and vehicle types.',
          },
          {
            title: 'Step 3: View Details',
            desc: 'Check the exact route on the map and see all stopovers.',
          },
          {
            title: 'Step 4: Start Journey',
            desc: 'Head to the station with confidence using our accurate data.',
          },
        ],
      },

      // ── Route Information ──
      ri: {
        pageTitle: 'Route Information',
        selectRoute: 'Select route...',
        from: 'Origin',
        to: 'Destination',
        quickSelect: 'Quick Select',
        searchBtn: 'Search',
        noResult: 'No matching routes found',
        via: 'via',
        line: 'Line',
        startAt: 'Start at',
        endAt: 'End at',
        mapSimulation: 'Simulate Route on Map',
        closeMap: 'Close Map Simulation',
        viewSchedule: 'View Schedule',
        vehicleAc: 'AC',
        vehicleFan: 'Fan',
        vehicleMinibus: 'Minibus',
        vehicleVan: 'Van',
        vehicleBus: 'Bus',
      },

      // ── Bus Stops ──
      busStops: {
        title: 'Bus Stops',
        searchPlaceholder: 'Search bus stops...',
        noResult: 'No matching stops found',
        filters: {
          allOrigins: 'All Origins',
          all: 'All',
          bus: 'Bus',
          minibus: 'Minibus',
          van: 'Van',
        },
        card: {
          stop: 'Stop:',
          line: 'Line',
        }
      },

      // ── Help ──
      help: {
        title: 'Help & Support Hub',
        subtitle: 'BKS Official Contact & Support Hub',
        bksPortal: 'Contact The Transport Co., Ltd.',
        bksPortalDesc: 'Send complaints, inquiries, or feedback via the official website',
        goToWebsite: 'Go to Official Website',
        hotline: 'Hotlines & Contact Numbers',
        callCenter: 'BKS Call Center (24 Hours)',
        callCenterDesc: 'Inquire about schedules and routes nationwide',
        callBtn: 'Call',
        hq: 'BKS Headquarters (Mo Chit 2)',
        hqDesc: 'Call 0-2936-2852 to 66',
        callOut: 'Call Now',
        terminalsTitle: 'Bus Terminal Phone Directory',
        terminals: [
          { name: 'Nakhon Ratchasima Terminal 1 (Old)' },
          { name: 'Nakhon Ratchasima Terminal 2 (New)' },
          { name: 'Bangkok Terminal (Mo Chit 2)' },
        ],
        faqTitle: 'Frequently Asked Questions (FAQ)',
        faqs: [
          {
            question: 'How to book BKS tickets online?',
            answer: 'You can search for bus trips and destinations on our homepage, or book via the BKS E-Ticket application and the official BKS website.',
          },
          {
            question: 'Cancellation, Refunds, or Rescheduling',
            answer: 'You must present your ticket and ID card at the BKS ticket counter at the bus terminal at least 3 hours before departure.',
          },
          {
            question: 'Baggage Allowance Policy',
            answer: 'Each passenger is allowed up to 2 pieces of carry-on baggage with a total weight not exceeding 20 kilograms, free of charge.',
          },
          {
            question: 'Tracking Lost Luggage',
            answer: 'Report immediately to the Customer Service Call Center 1490, providing the bus line number and travel time.',
          },
        ]
      },
      
      // ── Map ──
      map: {
        origin: 'Origin: ',
        dest: 'Dest: ',
      }
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'th',          // default Thai
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
