<?php
// Offer form handler for cPanel hosting. Sends the request to Marius's inbox on the same server
// and keeps a copy outside the web root, so no request is lost if an email goes astray.
// Answers JSON: {"success":true} or {"success":false,"message":"..."}.

const TO        = 'marius@bucatarulcopiilor.ro';
const FROM      = 'no-reply@bucatarulcopiilor.ro';
const SITE      = 'bucatarulcopiilor.ro';
const MAX_PER_H = 5;                                   // requests per IP per hour
const LOG_FILE  = __DIR__ . '/../oferte-site.log';     // outside public_html

date_default_timezone_set('Europe/Bucharest');
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function answer(bool $ok, string $msg = '', int $code = 200): void {
  http_response_code($code);
  echo json_encode(['success' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
  exit;
}
function field(string $k, int $max = 300): string {
  $v = trim((string)($_POST[$k] ?? ''));
  $v = str_replace(["\r\n", "\r"], "\n", $v);
  return mb_substr($v, 0, $max);
}
function one_line(string $v): string { return trim(preg_replace('/[\r\n\t]+/', ' ', $v)); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') answer(false, 'Metodă nepermisă.', 405);

// Bots: hidden checkbox ticked, no JS timer, or filled in faster than a person can
if (!empty($_POST['botcheck'])) answer(true);                       // pretend success
$elapsed = (int)($_POST['elapsed'] ?? 0);
if ($elapsed < 3000) answer(false, 'Vă rugăm încercați din nou.', 400);

// Rate limit per IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$rl = sys_get_temp_dir() . '/bc-form-' . hash('sha256', $ip . SITE);
$hits = array_filter(is_file($rl) ? (array)json_decode((string)file_get_contents($rl), true) : [], fn($t) => $t > time() - 3600);
if (count($hits) >= MAX_PER_H) answer(false, 'Prea multe cereri. Sunați-ne la 0743 064 433.', 429);
$hits[] = time();
@file_put_contents($rl, json_encode(array_values($hits)), LOCK_EX);

// Fields
$labels = [
  'nume' => 'Nume', 'institutia' => 'Instituția', 'tip' => 'Tip unitate', 'nr_copii' => 'Număr copii',
  'eveniment' => 'Eveniment', 'data_eveniment' => 'Data evenimentului', 'nr_persoane' => 'Număr persoane',
  'localitatea' => 'Localitatea', 'varste' => 'Vârste', 'data_start' => 'Data de început', 'alergii' => 'Alergii',
  'telefon' => 'Telefon', 'email' => 'Email', 'mesaj' => 'Mesaj',
];
$d = [];
foreach ($labels as $k => $_) $d[$k] = field($k, $k === 'mesaj' ? 3000 : 200);

if ($d['nume'] === '' || !preg_match('/^[0-9 +().\-]{9,}$/', $d['telefon'])) answer(false, 'Completați numele și un telefon valid.', 400);
if (($_POST['gdpr'] ?? '') !== 'acord') answer(false, 'Este nevoie de acordul pentru prelucrarea datelor.', 400);
$email = filter_var($d['email'], FILTER_VALIDATE_EMAIL) ? $d['email'] : '';

// Email
$isEvent = $d['eveniment'] !== '';
$subject = ($isEvent ? 'Cerere ofertă eveniment' : 'Cerere ofertă catering') . ' – ' . one_line($d['institutia'] ?: $d['nume']);
$body = "Cerere nouă de pe " . SITE . " (" . date('d.m.Y H:i') . ")\n\n";
foreach ($labels as $k => $label) if ($d[$k] !== '') $body .= $label . ':' . str_repeat(' ', max(1, 22 - mb_strlen($label . ':'))) . ($k === 'mesaj' ? "\n" : '') . $d[$k] . "\n";
$body .= "\nAcord prelucrare date: da\n";
if ($email === '') $body .= "\n(Nu a lăsat email: răspundeți la telefon.)\n";

$headers = [
  'From: =?UTF-8?B?' . base64_encode('Site Bucătarul copiilor') . '?= <' . FROM . '>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
];
if ($email !== '') $headers[] = 'Reply-To: ' . one_line($email);
$sent = @mail(TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f' . FROM);

// Copy outside the web root (delete old entries when no longer needed, see the privacy page)
@file_put_contents(LOG_FILE, json_encode(['la' => date('c'), 'trimis' => $sent] + $d, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

$sent ? answer(true) : answer(false, 'Cererea nu a plecat. Sunați-ne la 0743 064 433.', 500);
