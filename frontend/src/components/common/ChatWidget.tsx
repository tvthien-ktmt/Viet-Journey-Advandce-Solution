import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Xin chào! Viet Journey có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const timerRef = React.useRef<any>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    
    // Simulate bot response
    timerRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Cảm ơn bạn đã liên hệ. Hiện tại các tổng đài viên đang bận. Chúng tôi sẽ phản hồi lại qua email của bạn sớm nhất có thể!' 
      }]);
    }, 1000);
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-vna-blue text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">Viet Journey Support</h3>
              <p className="text-xs text-white/80">Chúng tôi luôn sẵn sàng hỗ trợ</p>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </Button>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-vna-gold text-vna-blue self-end rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 self-start rounded-tl-none shadow-sm'
              }`}>
                {m.text}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              className="flex-1 bg-slate-50 rounded-full px-4 outline-none text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon" className="bg-vna-blue hover:bg-vna-blue-700 rounded-full shrink-0">
              <Send size={16} />
            </Button>
          </form>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-vna-gold text-vna-blue hover:bg-yellow-500 shadow-xl flex items-center justify-center animate-bounce-short"
        >
          <MessageSquare size={24} />
        </Button>
      )}
    </div>
  );
}
