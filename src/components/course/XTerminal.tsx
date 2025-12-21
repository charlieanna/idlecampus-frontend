import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Terminal as TerminalIcon, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export interface XTerminalProps {
  onCommand?: (command: string) => void;
  expectedCommand?: string | null;
  sessionId?: string;
  containerImage?: string;
  enableDocker?: boolean; // Mount Docker socket for Docker commands
}

export function XTerminal({
  onCommand,
  expectedCommand,
  sessionId = 'default',
  containerImage = 'ubuntu:22.04',
  enableDocker = false
}: XTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const commandBufferRef = useRef('');

  // Store onCommand in ref so it doesn't trigger re-initialization
  const onCommandRef = useRef(onCommand);
  useLayoutEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  // Track if terminal had focus before content updates
  const hadFocusRef = useRef(false);

  // When expectedCommand changes (new task), restore focus if terminal had it
  useEffect(() => {
    // Small delay to let React finish rendering, then restore focus
    if (hadFocusRef.current && xtermRef.current) {
      const timeoutId = setTimeout(() => {
        xtermRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [expectedCommand]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnecting(true);
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3000/cable`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to terminal channel
      ws.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'TerminalChannel',
          session_id: sessionId,
          image: containerImage,
          enable_docker: enableDocker
        })
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'ping') return;

      if (data.type === 'confirm_subscription') {
        console.log('Subscribed to terminal channel');
        setConnected(true);
        setConnecting(false);
        xtermRef.current?.writeln('\x1b[32m✓ Connected to Linux terminal\x1b[0m');
        xtermRef.current?.writeln('');
        return;
      }

      if (data.type === 'reject_subscription') {
        console.error('Subscription rejected');
        setConnecting(false);
        xtermRef.current?.writeln('\x1b[31m✗ Connection rejected\x1b[0m');
        return;
      }

      if (data.message?.output) {
        xtermRef.current?.write(data.message.output);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      setConnecting(false);
      xtermRef.current?.writeln('\x1b[31m✗ Disconnected\x1b[0m');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnecting(false);
    };

    wsRef.current = ws;
  }, [sessionId, containerImage, enableDocker]);

  const sendInput = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        command: 'message',
        identifier: JSON.stringify({
          channel: 'TerminalChannel',
          session_id: sessionId,
          image: containerImage,
          enable_docker: enableDocker
        }),
        data: JSON.stringify({ input: data })
      }));
    }
  }, [sessionId, containerImage, enableDocker]);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        cursor: '#22c55e',
        cursorAccent: '#0f172a',
        black: '#0f172a',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#e2e8f0',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#f8fafc',
      },
      rows: 24,
      cols: 80,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    // Delay fit to ensure container has dimensions
    setTimeout(() => {
      fitAddon.fit();
    }, 100);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln('\x1b[1;36m╔══════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[1;36m║  Linux Learning Terminal                             ║\x1b[0m');
    term.writeln('\x1b[1;36m╚══════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[33mConnecting to container...\x1b[0m');
    term.writeln('');

    // Track focus state
    term.textarea?.addEventListener('focus', () => {
      hadFocusRef.current = true;
    });
    term.textarea?.addEventListener('blur', () => {
      hadFocusRef.current = false;
    });

    // Handle keyboard input
    term.onData((data) => {
      // Track command for validation
      if (data === '\r') {
        // Enter pressed - validate command
        const command = commandBufferRef.current.trim();
        if (command && onCommandRef.current) {
          onCommandRef.current(command);
        }
        commandBufferRef.current = '';
      } else if (data === '\x7f') {
        // Backspace
        commandBufferRef.current = commandBufferRef.current.slice(0, -1);
      } else if (data.charCodeAt(0) >= 32) {
        // Regular character
        commandBufferRef.current += data;
      }

      // Send to backend
      sendInput(data);
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
      // Send resize to backend
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          command: 'message',
          identifier: JSON.stringify({
            channel: 'TerminalChannel',
            session_id: sessionId,
            image: containerImage,
            enable_docker: enableDocker
          }),
          data: JSON.stringify({
            resize: { cols: term.cols, rows: term.rows }
          })
        }));
      }
    };

    window.addEventListener('resize', handleResize);

    // Connect WebSocket
    connectWebSocket();

    return () => {
      window.removeEventListener('resize', handleResize);
      wsRef.current?.close();
      term.dispose();
    };
    // Note: onCommand is accessed via ref, not as dependency, to prevent re-init on every render
  }, [connectWebSocket, sendInput, sessionId, containerImage]);

  const handleReconnect = () => {
    wsRef.current?.close();
    xtermRef.current?.clear();
    xtermRef.current?.writeln('\x1b[33mReconnecting...\x1b[0m');
    connectWebSocket();
  };

  const handleClear = () => {
    xtermRef.current?.clear();
    sendInput('clear\r');
  };

  // Focus the terminal
  const focusTerminal = useCallback(() => {
    xtermRef.current?.focus();
  }, []);

  // Click on terminal container should focus it
  const handleTerminalClick = () => {
    focusTerminal();
  };

  return (
    <Card className="flex flex-col bg-slate-900 border-slate-700 h-full">
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">Linux Terminal</span>
          {connected ? (
            <Badge className="bg-green-600 text-white text-xs flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              Connected
            </Badge>
          ) : connecting ? (
            <Badge className="bg-yellow-600 text-white text-xs flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Connecting
            </Badge>
          ) : (
            <Badge className="bg-red-600 text-white text-xs flex items-center gap-1">
              <WifiOff className="w-3 h-3" />
              Disconnected
            </Badge>
          )}
          {expectedCommand && (
            <Badge className="bg-blue-600 text-white text-xs ml-2">
              Expected: {expectedCommand}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={handleReconnect}
            title="Reconnect"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={handleClear}
            title="Clear"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 p-2 cursor-text"
        style={{ minHeight: '300px' }}
        onClick={handleTerminalClick}
      />
    </Card>
  );
}
