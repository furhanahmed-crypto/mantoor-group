<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require 'php-mailer/PHPMailer.php';
require 'php-mailer/SMTP.php';
require 'php-mailer/Exception.php';

header('Content-Type: application/json');

if (
    isset($_POST['name']) &&
    isset($_POST['email']) &&
    isset($_POST['phone']) &&
    isset($_POST['project'])
) {

    $name    = trim($_POST['name']);
    $email   = trim($_POST['email']);
    $phone   = trim($_POST['phone']);
    $project = trim($_POST['project']);
    $remarks = isset($_POST['remarks']) ? trim($_POST['remarks']) : '';

    $mail = new PHPMailer(true);

    $mail->IsSMTP();
    $mail->SMTPAuth = false;
    $mail->Port = 25;
    $mail->Host = 'localhost';
    $mail->Username = 'sales@mantoorgroup.com';
    $mail->Password = 'sales@mantoor';

    $mail->IsSendmail();

    $mail->From = 'sales@mantoorgroup.com';
    $mail->FromName = 'Mantoor Group';
    $mail->AddAddress('sales@mantoorgroup.com');
    $mail->AddAddress('f4rh4n6710@gmail.com');

    $mail->Subject = $project . ' brochure downloaded';
    $mail->WordWrap = 80;

    $body  = '<h2>' . htmlspecialchars($project) . ' brochure downloaded</h2>';
    $body .= '<p>A user downloaded the brochure with the following details:</p>';
    $body .= '<p><strong>Name:</strong> ' . htmlspecialchars($name) . '</p>';
    $body .= '<p><strong>Phone:</strong> ' . htmlspecialchars($phone) . '</p>';
    $body .= '<p><strong>Email:</strong> ' . htmlspecialchars($email) . '</p>';
    $body .= '<p><strong>Project:</strong> ' . htmlspecialchars($project) . '</p>';
    $body .= '<p><strong>Remarks:</strong> ' . htmlspecialchars($remarks !== '' ? $remarks : '(none)') . '</p>';

    $mail->MsgHTML($body);
    $mail->IsHTML(true);

    try {
        $mail->Send();
        echo json_encode(['success' => true, 'message' => 'Email sent']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Something Wrong. ' . $mail->ErrorInfo,
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
}
